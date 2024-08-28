import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LocalSignInDto,
  SignInWithAppleDto,
  SignInWithGoogleDto,
  SignInWithKakaoDto,
  TestSignInDto,
} from './dto/sign-in.dto';
import axios from 'axios';
import { IdentitiesService } from './identities.service';
import { ProviderType } from './entities/identity.entity';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from './mail.service';
import {
  LocalSendEmailDto,
  LocalSignUpDto,
  LocalVerifyEmailDto,
} from './dto/sign-up.dto';
import { EmailAuth } from './entities/email-auth.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import appleSigninAuth from 'apple-signin-auth';
import { makeUUID } from 'src/rules';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    public repo: Repository<User>,
    private identityService: IdentitiesService,
    private authService: AuthService,
    private mailService: MailService,
    @InjectRepository(EmailAuth)
    private emailAuthRepo: Repository<EmailAuth>,
    private eventEmitter: EventEmitter2,
  ) {
    super(repo);
  }

  async signInWithKakao(dto: SignInWithKakaoDto) {
    console.log(dto);

    // TODO: req kakao auth check api
    const url = 'https://kapi.kakao.com/v2/user/me';
    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${dto.accessToken}` },
      });
      const kakaoUserId = data.id;
      const checkUser = await this.identityService.findOne({
        where: { providerType: ProviderType.KAKAO, identifier: kakaoUserId },
      });
      if (checkUser) {
        await this.checkWithdrawalPolicy(checkUser.userId);
      }
      if (!checkUser) {
        // TODO: transaction
        // create user
        const user = await this.repo.save({
          name: makeUUID(),
        });

        await this.identityService.repo.save({
          providerType: ProviderType.KAKAO,
          identifier: kakaoUserId,
          userId: user.id,
          email: data?.kakao_account?.email || null,
        });
      }

      const identity = await this.identityService.repo.findOne({
        where: { providerType: ProviderType.KAKAO, identifier: kakaoUserId },
        relations: ['user'],
      });
      if (!identity.user) {
        throw new ForbiddenException('탈퇴된 사용자입니다.');
      }

      return await this.authService.signIn(identity.user);

      // TODO: create token
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signInWithGoogle(dto: SignInWithGoogleDto) {
    try {
      const result = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${dto.idToken}`,
      );
      const { email: googleEmail, sub: subId } = result.data;
      console.log(googleEmail, subId);
      const checkUser = await this.identityService.findOne({
        where: { providerType: ProviderType.GOOGLE, identifier: subId },
      });
      if (checkUser) {
        await this.checkWithdrawalPolicy(checkUser.userId);
      }
      if (!checkUser) {
        // create user
        const user = await this.repo.save({
          name: makeUUID(),
        });

        await this.identityService.repo.save({
          providerType: ProviderType.GOOGLE,
          identifier: subId,
          userId: user.id,
          email: googleEmail,
        });
      }

      const identity = await this.identityService.repo.findOne({
        where: { providerType: ProviderType.GOOGLE, identifier: subId },
        relations: ['user'],
      });
      if (!identity.user) {
        throw new ForbiddenException('탈퇴된 사용자입니다.');
      }

      return await this.authService.signIn(identity.user);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signInWithApple(dto: SignInWithAppleDto) {
    // crypto.createHash('sha256').update(nonce).digest('hex');
    // crypto.
    try {
      const idToken = dto.idToken;
      const { sub, email } = await appleSigninAuth.verifyIdToken(idToken);

      const checkUser = await this.identityService.findOne({
        where: { providerType: ProviderType.APPLE, identifier: sub },
      });
      if (checkUser) {
        await this.checkWithdrawalPolicy(checkUser.userId);
      }
      if (!checkUser) {
        // create user
        const user = await this.repo.save({
          name: makeUUID(),
        });

        await this.identityService.repo.save({
          providerType: ProviderType.APPLE,
          identifier: sub,
          userId: user.id,
          email,
        });
      }

      const identity = await this.identityService.repo.findOne({
        where: { providerType: ProviderType.APPLE, identifier: sub },
        relations: ['user'],
      });
      if (!identity.user) {
        throw new ForbiddenException('탈퇴된 사용자입니다.');
      }

      return await this.authService.signIn(identity.user);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async testLogin(dto: TestSignInDto) {
    const user = await this.repo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new ForbiddenException('탈퇴된 사용자입니다.');
    }
    return await this.authService.signIn(user);
  }

  async sendEmail(dto: LocalSendEmailDto) {
    console.log(dto);
    // check email
    // const checkEmail = await this.repo.findOne({ where: { email: dto.email } });
    const checkEmail = await this.identityService.findOne({
      where: { email: dto.email, providerType: ProviderType.LOCAL },
    });
    // create 4 number code
    const code = (Math.floor(Math.random() * 9000) + 1000).toString();
    if (dto.isSignUp) {
      if (checkEmail) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      // send mail
      await this.mailService.sendMail(
        dto.email,
        '회원가입을 위해 메일 인증을 완료해주세요.',
        `인증 코드: ${code}`,
      );

      // save code
    } else {
      if (!checkEmail) {
        throw new BadRequestException('가입되지 않은 이메일입니다.');
      }

      // send mail
      await this.mailService.sendMail(
        dto.email,
        '비밀번호 초기화를 위한 인증',
        `인증 코드: ${code}`,
      );
    }
    // save code
    await this.emailAuthRepo.save({ email: dto.email, code });
  }

  async verifyEmail(dto: LocalVerifyEmailDto) {
    // find email code
    const emailAuth = await this.emailAuthRepo.findOne({
      where: { email: dto.email },
      order: { createdAt: 'DESC' },
    });
    console.log(emailAuth);

    if (!emailAuth) {
      throw new NotFoundException('인증 코드를 찾을 수 없습니다.');
    } else if (emailAuth.code !== dto.code) {
      throw new BadRequestException('인증 코드가 일치하지 않습니다.');
    }

    // update emailAuth
    await this.emailAuthRepo.update(emailAuth.id, { isCertified: true });
  }

  async signUpLocal(dto: LocalSignUpDto) {
    try {
      const checkEmail = await this.identityService.findOne({
        where: { email: dto.email, providerType: ProviderType.LOCAL },
      });
      if (checkEmail) {
        await this.checkWithdrawalPolicy(checkEmail.userId);
      }
      if (checkEmail) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      // check unique name
      const checkName = await this.repo.find({ where: { name: dto.name } });
      if (checkName.length > 0) {
        throw new BadRequestException('이미 사용중인 닉네임입니다.');
      }

      // create user
      const user = await this.repo.save({
        name: dto.name,
      });

      // create identity
      console.log(User.hashPassword(dto.password));
      await this.identityService.repo.save({
        providerType: ProviderType.LOCAL,
        identifier: '-',
        userId: user.id,
        email: dto.email,
        password: User.hashPassword(dto.password),
      });
      // event emit for send mail
      this.eventEmitter.emit('signup', dto.email);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signInLocal(dto: LocalSignInDto) {
    // check user
    try {
      const identity = await this.identityService.findOne({
        where: { email: dto.email, providerType: ProviderType.LOCAL },
        relations: ['user'],
      });
      if (!identity) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      if (!identity.user) {
        throw new ForbiddenException('탈퇴된 사용자입니다.');
      }

      const isMatching = await bcrypt.compare(dto.password, identity.password);

      if (!isMatching) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }
      return await this.authService.signIn(identity.user);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async changeName(userId: number, name: string) {
    // check user
    try {
      const user = await this.repo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      const existUser = await this.repo.findOne({ where: { name } });
      if (existUser) {
        throw new BadRequestException('이미 사용중인 닉네임입니다.');
      }
      await this.repo.update(userId, { name });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async findPassword(email: string) {
    // check user
    try {
      const identity = await this.identityService.findOne({
        where: { email, providerType: ProviderType.LOCAL },
      });
      if (!identity) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      // create new password
      const newPassword = (Math.floor(Math.random() * 9000) + 1000).toString();

      await this.identityService.repo.update(identity.id, {
        password: newPassword,
      });

      // send mail
      await this.mailService.sendMail(
        email,
        '비밀번호 초기화',
        `임시 비밀번호: ${newPassword}`,
      );
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async changePassword(userId: number, password: string) {
    // check user
    try {
      const user = await this.repo.findOne({
        where: { id: userId },
        relations: ['identities'],
      });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      const identityId = user.identities.find(
        (identity) => identity.providerType === ProviderType.LOCAL,
      ).id;
      await this.identityService.repo.update(identityId, { password });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async deleteUser(userId: number) {
    // check user
    try {
      const user = await this.repo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      await this.repo.softDelete(userId);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getProfile(userId: number) {
    // check user
    try {
      const user = await this.repo.findOne({
        where: { id: userId },
        relations: ['identities'],
      });
      if (!user) {
        throw new ForbiddenException('탈퇴된 사용자입니다.');
      }
      return {
        email: user.identities[0].email,
        name: user.name,
        provider: user.identities[0].providerType,
      };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async checkWithdrawalPolicy(userId: number) {
    const now = new Date();
    const user = await this.repo.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    if (user.deletedAt !== null) {
      // can not sign up for 2 weeks
      const diff = now.getTime() - user.deletedAt.getTime();
      if (diff < 1000 * 60 * 60 * 24 * 14) {
        throw new ForbiddenException('탈퇴된 계정입니다.');
      }
    }
  }
}
