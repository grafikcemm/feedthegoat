export type MessageCategory =
  | 'responsibility'
  | 'action'
  | 'dopamine'
  | 'time'
  | 'systems'
  | 'risk'
  | 'discipline'
  | 'circle'
  | 'health'
  | 'money'
  | 'independence'
  | 'focus'
  | 'recovery'
  | 'reality'
  | 'self_respect';

export type WakeUpMessage = {
  id: string;
  category: MessageCategory;
  text: string;
  subtext?: string;
};

export const WAKE_UP_MESSAGES: WakeUpMessage[] = [
  // --- RESPONSIBILITY (Sorumluluk) ---
  { id: "res-01", category: "responsibility", text: "Kimse seni kurtarmaya gelmiyor. Direksiyona geç." },
  { id: "res-02", category: "responsibility", text: "Geçmişin açıklama olabilir; bugünün mazereti olamaz." },
  { id: "res-03", category: "responsibility", text: "Sorun senin eserin olmayabilir. Çözüm yine senin işin." },
  { id: "res-04", category: "responsibility", text: "Acınmak ilerleme sağlamaz. Eylem sağlar." },
  { id: "res-05", category: "responsibility", text: "Bugünü sahiplenmediğin her gün, hayatını başkasına bırakmış olursun." },
  { id: "res-06", category: "responsibility", text: "Hatalarını rasyonalize etmeyi bırak. Başarısızlıklarına yatırım yapıyorsun." },
  { id: "res-07", category: "responsibility", text: "Karar vermemek de bir karardır. Ve faturası en ağır olanıdır." },
  { id: "res-08", category: "responsibility", text: "Kafanda kurduğun senaryolardan çık, masadaki gerçeği yönet." },
  { id: "res-09", category: "responsibility", text: "İşlerin ters gitmesi senin suçun olmayabilir, ama düzeltmek senin sorumluluğun." },
  { id: "res-10", category: "responsibility", text: "Daha iyi bir hayat istiyorsan, acılarınla yüzleş, onları kullan." },
  { id: "res-11", category: "responsibility", text: "Kendi yarattığın krizlerden şikayet etmeyi bırak." },
  { id: "res-12", category: "responsibility", text: "Beklemek en tembelce mazerettir. Hiçbir zaman 'ideal an' gelmeyecek." },
  { id: "res-13", category: "responsibility", text: "Herkesin bahanesi var. Senin sonuçların olmalı." },
  { id: "res-14", category: "responsibility", text: "Hayat kurban rolünü reddedenlere ödülünü verir." },
  { id: "res-15", category: "responsibility", text: "Kim olduğun seçtiklerinden ibarettir. Yarın başka biri olmak istiyorsan, bugün başka bir şey seç." },

  // --- ACTION (Eylem) ---
  { id: "act-01", category: "action", text: "Motivasyon bekleme. Hareket et, motivasyon arkadan gelir." },
  { id: "act-02", category: "action", text: "İlk 10 dakika çoğu bahaneden güçlüdür." },
  { id: "act-03", category: "action", text: "Düşünmeyi bırak, başla. Netlik hareketin içinden çıkar." },
  { id: "act-04", category: "action", text: "Eylem karakterin dilidir." },
  { id: "act-05", category: "action", text: "Bugün küçük de olsa ilerleme, sıfır mükemmellikten değerlidir." },
  { id: "act-06", category: "action", text: "Plan yapmak çalışmak değildir. Ertelenmiş eylemlere plan adı verme." },
  { id: "act-07", category: "action", text: "Kusursuzu bekleyen korkağı oynuyordur. Kusurlu bir şekilde ilerle." },
  { id: "act-08", category: "action", text: "Düşünerek bir sorunu çözemediysen, eyleme geçerek çöz." },
  { id: "act-09", category: "action", text: "Adım atmadan önce tüm yolu göremezsin. Yürümeye başla." },
  { id: "act-10", category: "action", text: "Araştırma evresini bitir. Bilgi zehirlenmesi eylemsizliğin mazeretidir." },
  { id: "act-11", category: "action", text: "Şimdi yap. Sonra yok." },
  { id: "act-12", category: "action", text: "Zor geliyorsa, doğru şey odur. Üstüne git." },
  { id: "act-13", category: "action", text: "Başlamak için ilhama ihtiyacın yok. İşi bitirmeye ihtiyacın var." },
  { id: "act-14", category: "action", text: "Karar yorgunluğundan çık. Sadece bir sonraki fiziksel adımı belirle ve yap." },
  { id: "act-15", category: "action", text: "Eylemsizlik bir virüstür, panzehiri hızdır." },

  // --- DOPAMINE & DIGITAL DISTRACTION (Dopamin/Dijital) ---
  { id: "dop-01", category: "dopamine", text: "Telefonun seni oyalarken zamanını yemeye devam ediyor." },
  { id: "dop-02", category: "dopamine", text: "Ucuz dopamin, pahalı bir hayat doğurur." },
  { id: "dop-03", category: "dopamine", text: "Her kaydırış kısa haz verir, uzun vadeli güç alır." },
  { id: "dop-04", category: "dopamine", text: "Dikkatini koruyamayan biri hayatını da koruyamaz." },
  { id: "dop-05", category: "dopamine", text: "Eğlenceye kaçtığın her an, potansiyelinden çalıyorsun." },
  { id: "dop-06", category: "dopamine", text: "Bir uygulamanın ücretsiz olması, bedelini hayatınla ödediğin anlamına gelir." },
  { id: "dop-07", category: "dopamine", text: "Başkalarının sahte hayatlarını izlemek, kendi gerçek hayatını inşadan kaçmaktır." },
  { id: "dop-08", category: "dopamine", text: "Sıkılmaktan korkuyorsun. Sıkıntı, yaratıcılığın kapısıdır." },
  { id: "dop-09", category: "dopamine", text: "Eğer dikkatini sen yönetmezsen, mühendisler senin yerine yönetecek." },
  { id: "dop-10", category: "dopamine", text: "Telefonunu her rastgele açışında hedefinden biraz daha uzaklaşıyorsun." },
  { id: "dop-11", category: "dopamine", text: "Zihnini uyuşturmak kolaya kaçmaktır. Acıya katlanmak ise uyanmaktır." },
  { id: "dop-12", category: "dopamine", text: "Günde 3 saat ekran demek, aslına hayatının üçte birini silmek demektir." },
  { id: "dop-13", category: "dopamine", text: "Tüketici kimliğini bırak, üretici ol. Dopamini üretimden al." },
  { id: "dop-14", category: "dopamine", text: "Gerçek özgürlük, canın sıkıldığında cihaza uzanmamaktır." },
  { id: "dop-15", category: "dopamine", text: "Kontrolü geri al. Ekrana baktığın anlar hayatın olmasın." },

  // --- TIME & FAMILY (Zaman/Aile) ---
  { id: "tim-01", category: "time", text: "Sevdiklerin sonsuz değil. Ertelediğin ilgi geri dönmez." },
  { id: "tim-02", category: "time", text: "Ailenle geçireceğin günler sandığından daha az." },
  { id: "tim-03", category: "time", text: "Bir mesaj, bir arama, bir ziyaret bazen yıllık pişmanlığı engeller." },
  { id: "tim-04", category: "time", text: "Zaman sessiz ilerler; kayıp gürültüsüz olur." },
  { id: "tim-05", category: "time", text: "Bugün önem vermezsen, yarın sadece keşke kalır." },
  { id: "tim-06", category: "time", text: "Hayat çok hızlı geçmiyor, sen sadece dikkatsizce harcıyorsun." },
  { id: "tim-07", category: "time", text: "Bir günü öldürmek intihardır." },
  { id: "tim-08", category: "time", text: "Meşguliyet ile verimlilik aynı şey değildir. Boşa savruluyorsun." },
  { id: "tim-09", category: "time", text: "Her 'evet' dediğin şey, zamanından çaldığın bir 'hayır'dır." },
  { id: "tim-10", category: "time", text: "Ölüm gerçek, zaman sabit. Bugün bunu bilerek yaşa." },
  { id: "tim-11", category: "time", text: "Bugün telafisi olmayan tek kaynağını kullanıyorsun." },
  { id: "tim-12", category: "time", text: "Herkesin 24 saati var. Farkı yaratan o saatlerle ne yaptığındır." },
  { id: "tim-13", category: "time", text: "Ailenle beraberken gerçekten orada ol. Zihnin odada değilse, sen de yoksun." },
  { id: "tim-14", category: "time", text: "Geçen zaman, israf edilmiş zamansa ağır gelir." },
  { id: "tim-15", category: "time", text: "Yarın bir söz vermez kimseye, sahip olduğun tek an şu andır." },

  // --- SYSTEMS (Sistemler) ---
  { id: "sys-01", category: "systems", text: "Hedef yön verir; sistemi olan ilerler." },
  { id: "sys-02", category: "systems", text: "Hayatını büyük planlar değil, günlük tekrarlar taşır." },
  { id: "sys-03", category: "systems", text: "Disiplin, isteğe bağlı değil; tasarlanmış davranıştır." },
  { id: "sys-04", category: "systems", text: "Her günkü seçimlerin, gelecekteki karakterinin oylarıdır." },
  { id: "sys-05", category: "systems", text: "Kim olduğun, tekrar ettiğin şeydir." },
  { id: "sys-06", category: "systems", text: "Duygularına göre hareket edersen, hedeflerine hiçbir zaman ulaşamazsın." },
  { id: "sys-07", category: "systems", text: "Alışkanlıkların seni ya kurtarır ya da yavaş yavaş zehirler." },
  { id: "sys-08", category: "systems", text: "Mükemmel planlar genelde ertelenir. Yeteri kadar iyi sistemler uygulanır." },
  { id: "sys-09", category: "systems", text: "Hata yapmaktan korkma, sistemi işlet." },
  { id: "sys-10", category: "systems", text: "Sonuç değil, süreç yönetilir. Süreci kusursuz işlet." },
  { id: "sys-11", category: "systems", text: "Hedeflerin düştüğün son durak değil, sistemlerin tırmandığın merdivendir." },
  { id: "sys-12", category: "systems", text: "Yüksek motivasyon aramayı bırak. Kalıcı ritim kur." },
  { id: "sys-13", category: "systems", text: "Düzen, yaratıcılığı engellemez; ona güvenli bir koridor açar." },
  { id: "sys-14", category: "systems", text: "İradene güvenme, çevreni ve sistemini yönet." },
  { id: "sys-15", category: "systems", text: "En sıkıcı tekrarlar, en kalıcı sonuçları doğurur." },

  // --- RISK & COMFORT (Risk/Konfor) ---
  { id: "rsk-01", category: "risk", text: "En güvenli görünen hayat, çoğu zaman en büyük kayıptır." },
  { id: "rsk-02", category: "risk", text: "Risk almamak da bir risktir; üstelik sessiz olanı." },
  { id: "rsk-03", category: "risk", text: "Konfor kısa vadede sıcak, uzun vadede çürüktür." },
  { id: "rsk-04", category: "risk", text: "Korku yön göstermez; sadece test eder." },
  { id: "rsk-05", category: "risk", text: "Kaçındığın şey bazen büyümenin kapısıdır." },
  { id: "rsk-06", category: "risk", text: "Şuan yattığın yumuşak yatak, hayallerin için bir tabut olabilir." },
  { id: "rsk-07", category: "risk", text: "Rahat olduğun yer, öğrenmeyi bıraktığın yerdir." },
  { id: "rsk-08", category: "risk", text: "Başarısızlık olasılığını göze almayan, vasatı peşin kabul etmiştir." },
  { id: "rsk-09", category: "risk", text: "Hata yapmak ilerlemektir. Hiç hata yapmamak yerinde saymaktır." },
  { id: "rsk-10", category: "risk", text: "Konfor alanı lükstür ve bedelini sonradan çok ağır ödetir." },
  { id: "rsk-11", category: "risk", text: "Gerçek büyüme sınırlarında can çekişirken gerçekleşir." },
  { id: "rsk-12", category: "risk", text: "Bugün risk almazsan, yarın seçeneklerini kaybedersin." },
  { id: "rsk-13", category: "risk", text: "Neyden en çok çekiniyorsan, büyük ihtimalle ilk adım oradadır." },
  { id: "rsk-14", category: "risk", text: "Hayat risk alanları ödüllendirir, konforunu koruyanları ezer." },
  { id: "rsk-15", category: "risk", text: "Kaybetmek korkutucu ama hiç oynamamak trajiktir." },

  // --- DISCIPLINE (Disiplin) ---
  { id: "dis-01", category: "discipline", text: "Canın istemediğinde yaptığın şey, kim olduğunu belirler." },
  { id: "dis-02", category: "discipline", text: "Özsaygı, kendine verdiğin sözü tutunca büyür." },
  { id: "dis-03", category: "discipline", text: "Disiplin duyguyla değil, standartla çalışır." },
  { id: "dis-04", category: "discipline", text: "Sert günler bahaneyi değil sistemi test eder." },
  { id: "dis-05", category: "discipline", text: "Kendini yönetemeyen hiçbir şeyi uzun süre yönetemez." },
  { id: "dis-06", category: "discipline", text: "Özgürlüğün bedeli disiplindir." },
  { id: "dis-07", category: "discipline", text: "Başkalarına kural koymadan önce kendi kurallarına uy." },
  { id: "dis-08", category: "discipline", text: "Ağrıdan kaçış yok; ya disiplinin hafif ağrısını ya da pişmanlığın ağır yükünü seçeceksin." },
  { id: "dis-09", category: "discipline", text: "Heyecan geçicidir. Geriye sadece disiplin kalır." },
  { id: "dis-10", category: "discipline", text: "Zordan kaçmak en kolayıdır. Asıl mesele zoru alışkanlık haline getirmektir." },
  { id: "dis-11", category: "discipline", text: "Mazeretler mantıklı gelebilir, ama sonuç üretmezler." },
  { id: "dis-12", category: "discipline", text: "Kısa süreli haz için uzun süreli itibarını satma." },
  { id: "dis-13", category: "discipline", text: "Karar yorgunluğu disiplini eritir. Rutine bağla ve düşünmeyi bırak." },
  { id: "dis-14", category: "discipline", text: "Canın çok daha az çekseydi bile kalkıp o işi yapmalıydın." },
  { id: "dis-15", category: "discipline", text: "Profesyonel olmak demek, hava kötüyken de sahaya çıkmaktır." },

  // --- CIRCLE (Çevre/Sosyal) ---
  { id: "cir-01", category: "circle", text: "Herkesi yanında tutamazsın; bazen bu iyi bir şeydir." },
  { id: "cir-02", category: "circle", text: "Sürekli aşağı çeken çevre, görünmez bir frendir." },
  { id: "cir-03", category: "circle", text: "Yalnız yürümek bazen yanlış kalabalıkta kaybolmaktan iyidir." },
  { id: "cir-04", category: "circle", text: "Çevren sıradanlığı kutsuyorsa, hedefin ağırlaşır." },
  { id: "cir-05", category: "circle", text: "Frekansın değiştiğinde herkes yanında kalmaz." },
  { id: "cir-06", category: "circle", text: "Tolerans gösterdiğin davranış, etrafında kök salar." },
  { id: "cir-07", category: "circle", text: "İlham vermeyen, dedikodu yapan biriyle masada oturmak zihin yoksulluğudur." },
  { id: "cir-08", category: "circle", text: "Çevrendeki en zeki kişiysen, yanlış odadasın." },
  { id: "cir-09", category: "circle", text: "Kimlerle vakit geçirdiğin, kimi taklit edeceğinin haritasıdır." },
  { id: "cir-10", category: "circle", text: "Beklentini yüksek tutup çevreyi düşük tutamazsın." },
  { id: "cir-11", category: "circle", text: "Gerçek dostlar seni yukarı taşır, rahat alanına hapsetmez." },
  { id: "cir-12", category: "circle", text: "Seçkisiz ilişkiler, plansız bir hayat demektir." },
  { id: "cir-13", category: "circle", text: "Senin disiplinli olmanı küçümseyenler, kendi başarısızlıklarına kılıf arayanlardır." },
  { id: "cir-14", category: "circle", text: "Enerji vampirlerine nezaket göstermek kendi vaktine hakarettir." },
  { id: "cir-15", category: "circle", text: "Sevgini koru ama mesafeni ayarla. Zehir yavaşça yayılır." },

  // --- HEALTH (Sağlık/Fizik) ---
  { id: "hea-01", category: "health", text: "Yorgun beden, zayıf iradeyi hızlandırır." },
  { id: "hea-02", category: "health", text: "Uykusuzluk karakter testi değil, performans kaybıdır." },
  { id: "hea-03", category: "health", text: "Bedenin çöp kutusu değil, üretim motorundur." },
  { id: "hea-04", category: "health", text: "Enerji yönetimi olmadan disiplin sürdürülemez." },
  { id: "hea-05", category: "health", text: "Sağlık çökünce planlar da çöker." },
  { id: "hea-06", category: "health", text: "Hareketsizlik zihne giden zehirdir. Kalk ve terle." },
  { id: "hea-07", category: "health", text: "Yediklerin bugün sana keyif, yarın sana ağırlık verecek." },
  { id: "hea-08", category: "health", text: "Odaklanamamanın sebebi karakterin değil, beslenmen olabilir." },
  { id: "hea-09", category: "health", text: "Sınırlarını fiziksel olarak zorlamazsan, zihinsel sınırlarını hiç göremezsin." },
  { id: "hea-10", category: "health", text: "Uyku bir lüks değil, biyolojik bir emirdir. Direnmek aptallıktır." },
  { id: "hea-11", category: "health", text: "Bugün bedenine ne kadar saygı gösterirsen, yarın beynin sana o kadar öder." },
  { id: "hea-12", category: "health", text: "Su iç, yürü, terle, uyu. Antik döngüyü bozarsan hasta olursun." },
  { id: "hea-13", category: "health", text: "Ağırlık kaldırmak sadece kas değil, zihinsel dayanıklılık inşa eder." },
  { id: "hea-14", category: "health", text: "Ertesi günkü uyuşukluğunu suçlamayı bırak ve tabağına bak." },
  { id: "hea-15", category: "health", text: "Bedenine sadık olmazsan, o da senin kararlarına sadık olmaz." },

  // --- MONEY & PRODUCTION (Para/Üretim) ---
  { id: "mon-01", category: "money", text: "Harcama alışkanlığın, hedeflerinden daha dürüst konuşur." },
  { id: "mon-02", category: "money", text: "Para sadece kazanılmaz; korunur, yönlendirilir, çoğaltılır." },
  { id: "mon-03", category: "money", text: "Fırsat maliyeti görünmez ama gerçektir." },
  { id: "mon-04", category: "money", text: "Bugünkü rahatlık için yarının gücünü satma." },
  { id: "mon-05", category: "money", text: "Gelir akışı kurmayan biri sürekli zaman satar." },
  { id: "mon-06", category: "money", text: "Borç aptalların oyuncağı, akıllıların kaldıracıdır." },
  { id: "mon-07", category: "money", text: "Kazandığından daha az harcamak zeka değil, matematiksel mecburiyettir." },
  { id: "mon-08", category: "money", text: "Sorunları parayla çözemiyorsan, sorunun kaynağı sen olabilirsin." },
  { id: "mon-09", category: "money", text: "Geleceğin bugünkü tasarrufunla finanse edilecek." },
  { id: "mon-10", category: "money", text: "Para statü değil, özgürlük aracıdır. Satın aldığın şey birilerinin takdiriyse kaybediyorsun." },
  { id: "mon-11", category: "money", text: "Tüketimi üretimin üzerine çıkarırsan batarsın." },
  { id: "mon-12", category: "money", text: "Kimse becerilerini övmeyecek; piyasa sadece faydayı ödüllendirir." },
  { id: "mon-13", category: "money", text: "Değer üretmeden değer biçilmesini beklemek çocukluktur." },
  { id: "mon-14", category: "money", text: "Müşterinin problemi senin paranı basar. Problemi çöz." },
  { id: "mon-15", category: "money", text: "Becerilerin kapitalizme entegre olmadıkça sadece pahalı hobilerdir." },

  // --- INDEPENDENCE (Sürü/Bağımsızlık) ---
  { id: "ind-01", category: "independence", text: "Çoğunluk rahat olabilir; doğru olduğu anlamına gelmez." },
  { id: "ind-02", category: "independence", text: "Herkesin seçtiği yol, çoğu zaman en pahalı yoldur." },
  { id: "ind-03", category: "independence", text: "Sürü onay verir; bedelini sen ödersin." },
  { id: "ind-04", category: "independence", text: "Kendi hayatını yaşamak için önce başkalarının sesini kısmalısın." },
  { id: "ind-05", category: "independence", text: "Zihinsel bağımsızlık, gerçek özgürlüğün başlangıcıdır." },
  { id: "ind-06", category: "independence", text: "Trendlere kapılan, rüzgarda yapraktır." },
  { id: "ind-07", category: "independence", text: "Eğer herkes aynı şeyi yapıyorsa dur ve tersine bak." },
  { id: "ind-08", category: "independence", text: "Toplum sana konfor satar ve karşılığında itaat ister." },
  { id: "ind-09", category: "independence", text: "Klişeleri reddet. Sistemin sana biçtiği şablon ucuzdur." },
  { id: "ind-10", category: "independence", text: "Başkalarının onayını arayan biri asla liderlik edemez." },
  { id: "ind-11", category: "independence", text: "Farklı olmak risklidir, ancak aynı olmak yıkıcıdır." },
  { id: "ind-12", category: "independence", text: "Ortak aklın ortalama sonuçlar doğurduğunu unutma." },
  { id: "ind-13", category: "independence", text: "Senin planın yoksa başkalarının planının parçası olursun." },
  { id: "ind-14", category: "independence", text: "Övgülere sağır ol; onlar sürünün pışpışlamasıdır." },
  { id: "ind-15", category: "independence", text: "Gürültüyü kapat, zihninin sessiz kalmasına izin ver." },

  // --- FOCUS (Odak) ---
  { id: "foc-01", category: "focus", text: "Her şeye dokunan hiçbir şeyi ileri taşıyamaz." },
  { id: "foc-02", category: "focus", text: "Bugünün tek kritik işini koru." },
  { id: "foc-03", category: "focus", text: "Dağınık zihin, dağınık hayat üretir." },
  { id: "foc-04", category: "focus", text: "Odak bir yetenek değil; korunmuş dikkat alanıdır." },
  { id: "foc-05", category: "focus", text: "Derin çalışma, sessiz üstünlüktür." },
  { id: "foc-06", category: "focus", text: "Çoklu çalışma yalandır. Sadeleş ve tek şey yap." },
  { id: "foc-07", category: "focus", text: "Dikkatin kime aitse hayatını o yönetir." },
  { id: "foc-08", category: "focus", text: "Sıradan bir işi kesintisiz 2 saat yaparsan sihir oluşur." },
  { id: "foc-09", category: "focus", text: "Öncelikler listesi olmaz; sadece TEK bir öncelik olur." },
  { id: "foc-10", category: "focus", text: "Gürültülü şeylerin aciliyeti, senin hedeflerinin düşmanıdır." },
  { id: "foc-11", category: "focus", text: "Derin düşünce lüks değildir, problem çözmenin temelidir." },
  { id: "foc-12", category: "focus", text: "Ne yapacağın kadar, neyi yapmayacağın da stratejidir." },
  { id: "foc-13", category: "focus", text: "Hayır demeyi beceremediğin sürece odaklanamazsın." },
  { id: "foc-14", category: "focus", text: "Her fikre atlamak, aslında hiçbir şeye inanmamaktır." },
  { id: "foc-15", category: "focus", text: "Uçak moduna al. Sadece cihazı değil, kafanı da." },

  // --- RECOVERY & RESTART (Yeniden başlama) ---
  { id: "rec-01", category: "recovery", text: "Gün bozulduysa günü değil, sadece anı kaybettin." },
  { id: "rec-02", category: "recovery", text: "Kalan saatleri kurtarmak da disiplindir." },
  { id: "rec-03", category: "recovery", text: "Zincir kırıldıysa yas tutma; yeniden bağla." },
  { id: "rec-04", category: "recovery", text: "Bugün geç başladıysan yine de bugünündür." },
  { id: "rec-05", category: "recovery", text: "Sıfırlanmak zorunda değilsin; toparlanman yeterli." },
  { id: "rec-06", category: "recovery", text: "Düşmen doğal, kalkış süren karakterindir." },
  { id: "rec-07", category: "recovery", text: "Yarın daha iyi olmayacak, şimdi toparlamazsan." },
  { id: "rec-08", category: "recovery", text: "Mükemmeliyetçilik ertelemenin maskesidir. Kirli ilerle." },
  { id: "rec-09", category: "recovery", text: "Küçük bir hata büyük bir bahaneye dönüşmesin." },
  { id: "rec-10", category: "recovery", text: "Başarısızlıktan zevk alma ama öğrendiklerini silaha dönüştür." },
  { id: "rec-11", category: "recovery", text: "İki kere üst üste atlama. İlk kırılış kaza, ikincisi alışkanlıktır." },
  { id: "rec-12", category: "recovery", text: "100 puanlık işin 30'u yapıldı diye kalanı çöpe atılmaz." },
  { id: "rec-13", category: "recovery", text: "Suçluluk duyma, analiz et ve eylemi düzelt." },
  { id: "rec-14", category: "recovery", text: "Geç kalmış olman vazgeçmeni gerektirmez, koşmanı gerektirir." },
  { id: "rec-15", category: "recovery", text: "Savaş kaybedilmiş olabilir, orduyu topla." },

  // --- REALITY (Gerçekçilik / Acı Verici Doğrular) ---
  { id: "rea-01", category: "reality", text: "Hayat adil değil. Olmak zorunda da değil. Üretmeye devam et." },
  { id: "rea-02", category: "reality", text: "Başkalarının beklentileri seni bağlamaz." },
  { id: "rea-03", category: "reality", text: "Bir mucize beklemek, en yavaş ölüm şeklidir." },
  { id: "rea-04", category: "reality", text: "Dünya seni tanımak istemiyor; ne sunduğunla ilgileniyor." },
  { id: "rea-05", category: "reality", text: "Şikayet etmek, çözüm üretmeye enerji harcamaktır." },
  { id: "rea-06", category: "reality", text: "İyi niyet sonuç getirmez. İş planı sonuç getirir." },
  { id: "rea-07", category: "reality", text: "Sırf çok yoruldun diye doğru yolda değilsin. Belki de boşa kürek çekiyorsun." },
  { id: "rea-08", category: "reality", text: "Zaman en büyük öğretmendir ama bütün öğrencilerini öldürür." },
  { id: "rea-09", category: "reality", text: "Sana tepsiyle bir şey sunulmayacak. Kopartıp alacaksın." },
  { id: "rea-10", category: "reality", text: "İstediklerin ile elde ettiklerin arasındaki fark, ödediğin bedeldir." },
  { id: "rea-11", category: "reality", text: "Olasılıkları değil, önündeki işi düşün." },
  { id: "rea-12", category: "reality", text: "Eğer bir şey kolay görünüyorsa, başkası zaten yapmıştır." },
  { id: "rea-13", category: "reality", text: "Kim olduğunun hiçbir önemi yok, ne yaptığının önemi var." },
  { id: "rea-14", category: "reality", text: "Kendine acımak uyuşturucudur. Uyanık kal." },
  { id: "rea-15", category: "reality", text: "Hiç kimse başarını senden daha fazla düşünmüyor." },

  // --- SELF RESPECT (Kendine Saygı) ---
  { id: "sel-01", category: "self_respect", text: "Kendine verdiğin söz hafife alınırsa karakter zayıflar." },
  { id: "sel-02", category: "self_respect", text: "Özdisiplin, iç dünyanda kurduğun itibardır." },
  { id: "sel-03", category: "self_respect", text: "Kendi gözünde küçülme; sözüne ağırlık ver." },
  { id: "sel-04", category: "self_respect", text: "Saygı önce aynada başlar." },
  { id: "sel-05", category: "self_respect", text: "Kendine güven, kendine kanıt biriktirerek kurulur." },
  { id: "sel-06", category: "self_respect", text: "Gerektiğinde uzaklaşmayı bil. Sınır, kendine duyduğun saygıdır." },
  { id: "sel-07", category: "self_respect", text: "Aşağı çekildiğin yerde barınma." },
  { id: "sel-08", category: "self_respect", text: "Zamanını ucuza veren, ruhunu ucuza satmıştır." },
  { id: "sel-09", category: "self_respect", text: "Sen değer koymazsan, piyasa sana dip fiyatı çekecektir." },
  { id: "sel-10", category: "self_respect", text: "Geçmişin kölesi olma, bugünün ustası ol." },
  { id: "sel-11", category: "self_respect", text: "Başarısızlık ayıp değildir, denemekten korkmak saygısızlıktır." },
  { id: "sel-12", category: "self_respect", text: "Taviz verdiğin an, çizgiler bulanıklaşır." },
  { id: "sel-13", category: "self_respect", text: "Senin standardın, karşıdan beklediğin tabandır." },
  { id: "sel-14", category: "self_respect", text: "Yalan önce kendine söylenir ve orada zehirler." },
  { id: "sel-15", category: "self_respect", text: "Gün sonunda tek başınasın. Kendi karanlığından kaçamazsın." }
];
