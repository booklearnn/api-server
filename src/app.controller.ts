import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponse, BaseResponseType } from './common/base-response';
import { IsNotEmpty, IsString } from 'class-validator';
import { MailService } from './users/mail.service';
import { SupportDto } from './users/dto/sign-up.dto';

@ApiTags('/')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  checkHealth(): string {
    try {
      return this.appService.checkHealth();
    } catch (error) {
      return error.message;
    }
  }

  @ApiOperation({ summary: '서비스 이용약관' })
  @Get('/terms-of-service')
  async getTermsOfService(): Promise<BaseResponse> {
    try {
      const data = `<h1>서비스 이용약관</h1>
  
      <h2>제1조 [목적]</h2>
      <p>이 약관은 북런스튜디오 (이하 “회사”)가 제공하는 북런(이하 “서비스”)를 이용함에 있어 회사와 사용자 간의 권리ㆍ의무 및 책임사항을 규정함을 목적으로 합니다.</p>
      <p>서비스를 이용하고자 하는 자는 본 이용 약관을 자세히 읽은 후 이용 약관에 동의하지 않을 경우, 본 이용 약관에 동의 표시를 하거나 서비스에 등록 또는 액세스하거나 이를 이용(이하 “이용”)하지 않아야 합니다.</p>
    
      <h2>제2조 [용어의 정의]</h2>
      <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다. 이 약관에서 사용하는 용어 중 본 조에서 정하지 아니한 것은 회사 사이트의 별도 페이지 안내 및 관계 법령에서 정하는 바에 따르며, 그 외에는 일반 상관례에 따릅니다.</p>
      <ul>
          <li>“회사”란 재화 또는 용역(이하 “재화 등”이라 함)을 사용하여 이용자에게 서비스를 제공할 목적으로 컴퓨터 등 정보통신설비를 이용하여 설정한 가상의 영업장을 말하며, 아울러 “회사”가 제작, 운영하는 모바일 어플리케이션 및 인터넷 웹사이트(이하 “사이트”)을 운영하는 사업자의 의미로도 사용합니다.</li>
          <li>“서비스”란 회사가 휴대용 단말기, 개인용 컴퓨터 등 전기통신설비를 포함한 각종 유무선 장치와 모바일 어플리케이션, 웹사이트를 통해 이용자에게 제공하는 디지털 콘텐츠 등 제반 서비스를 말합니다.</li>
          <li>“이용자”란 “사이트”에 접속하여 이 약관에 따라 “회사”가 제공하는 “서비스”를 받는 회원 및 비회원을 말합니다.</li>
          <li>“회원”이란 회사와 이용계약을 체결하고 아이디(ID)를 부여 받은 이용자로서 회사의 정보를 제공받으며 회사가 제공하는 유ㆍ무상 서비스를 지속적으로 이용할 수 있는 자를 말합니다.</li>
      </ul>
    
      <h2>제3조 [약관의 효력 및 변경]</h2>
      <ol>
          <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
          <li>회사는 합리적인 사유가 발생할 경우 관련 법령을 준수하며 이용약관을 개정할 수 있습니다.</li>
          <li>본 약관이 변경된 경우에는 개정된 약관이 적용되는 날로부터 이용자에게 통지 후 홈페이지에 게시함으로써 효력이 발생합니다. 다만, 이용자의 권리 또는 의무에 중대한 영향을 주는 변경에 대해서는 최소 7일 이전에 고지합니다.</li>
      </ol>
    
      <h2>제4조 [서비스의 제공 및 변경]</h2>
          <p>회사는 다음과 같은 서비스를 제공합니다.</p>
          <ul>
          <li>북런 관련 서비스</li>
          <li>기타 회사가 정하는 서비스</li>
          </ul>
          <p>회사는 이용자에게 사전 공지하고 서비스를 변경할 수 있습니다.</p>
          <p>회사는 서비스 제공 중 또는 서비스의 일부가 변경되거나 중단되어 발생하는 문제에 대해 책임을 지지 않습니다.</p>
    
      <h2>제5조 [서비스 이용계약의 성립]</h2>
          <p>이용계약은 이용자의 이용신청에 대한 회사의 승낙과 이용자의 약관에 동의함으로써 성립됩니다.</p>
          <p>회사는 이용자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 단, 다음 각 호에 해당하는 신청에 대해서는 승낙을 거부할 수 있습니다.</p>
          <ul>
              <li>실명이 아니거나 타인의 명의를 도용한 경우</li>
              <li>허위의 정보를 기재하거나 회사가 제시하는 내용을 기재하지 않은 경우</li>
              <li>기타 회사가 정한 이용신청 요건을 충족하지 않거나 위반한 경우</li>
          </ul>
    
      <h2>제6조 [서비스의 이용]</h2>
      <ol>
          <li>이용자는 회사가 정한 서비스 이용절차에 따라 서비스를 이용하여야 합니다.</li>
          <li>이용자는 서비스 이용 시 발생하는 개인정보 및 기타 정보에 대해 모든 책임을 부담합니다.</li>
          <li>이용자는 서비스를 본 용도 이외의 목적으로 사용하여서는 안 됩니다.</li>
      </ol>
    
      <h2>제7조 [서비스의 중단]</h2>
      <ol>
          <li>회사는 서비스의 운영상 또는 기술상의 필요에 따라 제공하는 서비스의 전부 또는 일부를 수정, 중단할 수 있습니다.</li>
          <li>회사는 제1항에 따른 서비스의 중단으로 발생하는 문제에 대해 책임을 지지 않습니다.</li>
      </ol>
    
      <h2>제8조 [정보의 제공 및 광고의 게재]</h2>
      <ol>
          <li>회사는 이용자에게 서비스 이용에 필요한 다양한 정보를 제공할 수 있습니다.</li>
          <li>회사는 서비스의 운영과 관련하여 광고를 서비스에 게재할 수 있습니다.</li>
      </ol>
    
      <h2>제9조 [저작권의 귀속]</h2>
      <p>회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속합니다.</p>
    
      <h2>제10조 [면책 및 책임제한]</h2>
          <p>회사는 다음 각 호의 사유로 인하여 이용자에게 발생한 손해에 대해 책임을 지지 않습니다.</p>
          <ul>
              <li>회사의 고의 또는 과실이 없는 경우</li>
              <li>이용자의 고의 또는 과실로 인한 경우</li>
              <li>제3자가 불법적으로 회사의 서버에 접속 또는 서버를 이용함으로써 발생한 경우</li>
              <li>천재지변, 전쟁, 기간통신사업자의 서비스 중지, 해결이 불가능한 기술적 결함 기타 불가항력적인 사유로 인한 경우</li>
          </ul>
    
      <h2>제11조 [분쟁의 해결]</h2>
      <p>서비스 이용으로 발생한 분쟁에 대해서는 회사와 이용자가 합의하여 해결합니다. 합의가 이루어지지 않을 경우, 관할법원의 전속관할로 합니다.</p>
    
      <h2>제12조 [준거법 및 관할법원]</h2>
      <p>본 약관의 해석 및 회사와 이용자 간 분쟁에 대한 소송은 대한민국 법을 준거법으로 합니다. 소송은 서울중앙지방법원을 관할법원으로 합니다.</p>
    
      <p>본 약관은 2024년 4월 8일부터 적용됩니다.</p>`;
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '서비스 이용약관 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '개인정보 처리방침' })
  @Get('/privacy-policy')
  async getPrivacyPolicy(): Promise<BaseResponse> {
    try {
      const data = `<h1>개인정보처리방침</h1>
      <p>북런 스튜디오(이하 “회사”)가 제공하는 북런(이하 “서비스”) 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
    
      <h2>제2조(개인정보의 처리 및 보유 기간)</h2>
      <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
      <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
      <ol>
          <li>
              <strong>&lt;회원가입 및 관리&gt;</strong>
              <p>&lt;회원가입 및 관리&gt;와 관련한 개인정보는 수집.이용에 관한 동의일로부터&lt;서비스를 탈퇴 또는 이용자격을 상실할 경우 지체없이 파기 전까지 위 이용목적을 위하여 보유.이용됩니다.</p>
              <p>보유근거 : 정보통신망 이용촉진 및 정보보호 등에 관한 법률</p>
          </li>
          <li>
              <strong>&lt;재화 또는 서비스 제공&gt;</strong>
              <p>&lt;재화 또는 서비스 제공&gt;와 관련한 개인정보는 수집.이용에 관한 동의일로부터&lt;지체없이 파기&gt;까지 위 이용목적을 위하여 보유.이용됩니다.</p>
              <p>보유근거 : 전자상거래 등에서의 소비자보호에 관한 법률</p>
              <p>관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</p>
          </li>
          <li>
              <strong>&lt;마케팅 및 광고에의 활용&gt;</strong>
              <p>&lt;마케팅 및 광고에의 활용&gt;와 관련한 개인정보는 수집.이용에 관한 동의일로부터&lt;지체없이 파기&gt;까지 위 이용목적을 위하여 보유.이용됩니다.</p>
              <p>보유근거 : 정보통신망 이용촉진 및 정보보호 등에 관한 법률</p>
          </li>
      </ol>
      <h2>제3조(처리하는 개인정보의 항목)</h2>
      <p>① 회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
      <ul>
          <li>회원 가입 시 기본수집사항(필수항목): 로그인 SNS 식별자(Apple, Google, Kakao 로부터 제공받은 유저식별자), 프로필 이름</li>
          <li>서비스 이용과정에서 자동으로 수집: 기기 정보(모델명, OS), 앱 설정값, 메타 데이터, 서비스 이용기록</li>
          <li>유료서비스 이용 시: 오픈마켓사업자가 제공하는 구입 내역</li>
          <li>고충처리 시: 이용자로부터 위 각 정보 중 필요한 항목 및 해당 고충처리에 필요한 별개 항목을 수집 및 처리</li>
      </ul>
    
      <h2>제4조(개인정보의 제3자 제공에 관한 사항)</h2>
      <p>① 회사는 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
      <p>② 회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다.</p>
    
      <h2>제5조(개인정보처리의 위탁에 관한 사항)</h2>
      <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
      <ul>
          <li><strong>서비스 이용에 대한 데이터 처리</strong>
              <ul>
                  <li>위탁받는 자 (수탁자): Google Analytics, Google Cloud Platform (Firebase)</li>
                  <li>위탁하는 업무의 내용: 회원제 서비스 이용에 따른 본인확인, 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
                  <li>위탁기간: 회원 탈퇴시까지</li>
              </ul>
          </li>
      </ul>
      <p>② 회사는 위탁계약 체결시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
      <p>③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</p>
      <h2>제6조(개인정보의 파기절차 및 파기방법)</h2>
      <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
      <p>② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
      <p>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
      <strong>파기절차</strong>
      <ul>
          <li>회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
      </ul>
      <strong>파기방법</strong>
      <ul>
          <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
      </ul>
    
      <h2>제7조(정보주체와 법정대리인의 권리·의무 및 그 행사방법에 관한 사항)</h2>
      <p>① 정보주체는 북적 스튜디오에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
      <p>② 제1항에 따른 권리 행사는 북적 스튜디오에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
      <p>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>
      <p>④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.</p>
      <p>⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</p>
      <p>⑥ 회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</p>
    
      <h2>제8조(개인정보의 안전성 확보조치에 관한 사항)</h2>
      <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
      <ul>
          <li>개인정보에 대한 접근 제한: 개인정보를 처리하는 데이터베이스 시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</li>
          <li>개인정보의 암호화: 이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</li>
          <li>해킹 등에 대비한 기술적 대책: 회사가 제공하는 서비스는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</li>
      </ul>
    
      <h2>제9조(개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항)</h2>
      <p>북적 스튜디오은(는) 정보주체의 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용하지 않습니다.</p>
    
      <h2>제10조(행태정보의 수집·이용·제공 및 거부 등에 관한 사항)</h2>
      <p>행태정보의 수집·이용·제공 및 거부 등에 관한 사항</p>
      <p><개인정보처리자명>은(는) 온라인 맞춤형 광고 등을 위한 행태정보를 수집·이용·제공하지 않습니다.</p>
      <h2>제11조(개인정보 보호책임자에 관한 사항)</h2>
      <p>북적 스튜디오은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
      <p>▶ 개인정보 보호책임자</p>
      <ul>
          <li>성명: 윤영주</li>
          <li>직책: 대표이사</li>
          <li>연락처: <a href="mailto:booklearn.contact@gmail.com">booklearn.contact@gmail.com</a></li>
      </ul>
      <p>정보주체는 회사의의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>
    
      <h2>제12조(정보주체의 권익침해에 대한 구제방법)</h2>
      <p>정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.</p>
      <ul>
          <li>개인정보분쟁조정위원회 : (국번없이) 1833-6972 (<a href="http://www.kopico.go.kr/">www.kopico.go.kr</a>)</li>
          <li>개인정보침해신고센터 : (국번없이) 118 (<a href="http://privacy.kisa.or.kr/">privacy.kisa.or.kr</a>)</li>
          <li>대검찰청 : (국번없이) 1301 (<a href="http://www.spo.go.kr/">www.spo.go.kr</a>)</li>
          <li>경찰청 : (국번없이) 182 (<a href="http://ecrm.cyber.go.kr/">ecrm.cyber.go.kr</a>)</li>
      </ul>
      <p>「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대 하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.</p>
      <p>※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(<a href="http://www.simpan.go.kr/">www.simpan.go.kr</a>) 홈페이지를 참고하시기 바랍니다.</p>
    
      <h2>제13조(개인정보 처리방침 변경)</h2>
      <p>회사는 법률이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보처리방침을 수정할 수 있습니다. 개인정보처리방침이 변경되는 경우 회사는 효력발생일 이전에 미리 공지하겠습니다.</p>
      <p><strong>부칙 (2024. 04. 10.)</strong></p>
      <p>이 개인정보처리방침은 2024년 4월 10부터 적용됩니다.</p>`;
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '개인정보 처리방침 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: '개인정보 처리방침 조회 실패 😥',
      };
    }
  }

  @ApiOperation({ summary: '릴리즈 노트' })
  @Get('/release-notes')
  async getReleaseNotes(): Promise<BaseResponse> {
    try {
      const data = [
        {
          id: 1,
          version: 'v0.1.0',
          date: '2024-04-10',
          title: '앱 출시',
          content: `<html><body><h1>앱 출시! 🎉<h1></body></html>`,
        },
      ];
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '릴리즈 노트 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: '릴리즈 노트 조회 실패 😥',
      };
    }
  }

  @ApiOperation({ summary: '앱 버전' })
  @Get('/app-versions')
  async getAppVersions(): Promise<BaseResponse> {
    try {
      const data = [
        {
          id: 1,
          version: 'v1.0.1',
          createdAt: '2024-05-07 00:00:00',
          required: false,
        },
      ];
      return {
        type: BaseResponseType.SUCCESS,
        data,
        message: '앱 버전 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: '앱 버전 조회 실패 😥',
      };
    }
  }
}
