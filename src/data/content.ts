export type NewsItem = {
  id: string
  title: string
  excerpt: string
  body: string
  category: string
  date: string
  readMin: number
  image: string
  /** domestic = дотоод, foreign = гадаад, kpop = K-pop, yellow = шар */
  region?: 'domestic' | 'foreign' | 'kpop' | 'yellow'
}

export type VideoItem = {
  id: string
  youtubeId: string
  title: string
  description: string
  views: string
  duration: string
  published: string
}

export type Rapper = {
  id: string
  name: string
  aka: string
  city: string
  years: string
  bio: string
  story: string
  image: string
  tags: string[]
  streams: string
  region?: 'domestic' | 'foreign'
  verified?: boolean
  ownerEmail?: string
  ownerUserId?: string
}

export type RankItem = {
  id: string
  name: string
  track: string
  score: number
  change: number
  streams: string
}

export const news: NewsItem[] = [
  {
    id: 'chart-war-2026',
    title: '2026 оны чарт дайн: стриминг vs жинхэнэ фэн',
    excerpt:
      'Монголын хип-хоп зах зээл дээр стриминг тоо болон концерт борлуулалт хоорондын зөрүү улам тод болж байна.',
    body: `Сүүлийн 12 сард Spotify, YouTube Music дээрх топ трекүүдийн стрим болон концерт тасалбарын борлуулалт шууд хамааралгүй болсон нь анзаарагдаж байна.

Зарим рэпперүүд чартад өндөр байр эзэлж байгаа ч live үзэгчдийн тоо харьцангуй бага байгаа нь "bot / playlist push" эсвэл богино хугацааны viral эффекттэй холбоотой гэж шинжээчид үзэж байна.

Харин эсрэгээрээ дунд түвшний стримтэй ч тогтмол тулаан, бие даасан шоу хийдэг артистуудын фэн бааз илүү тогтвортой байна. Newsac-ийн шинжилгээгээр энэ зөрүү 2026 онд зах зээлийн гол ярианы сэдэв болох төлөвтэй.`,
    category: 'Шинжилгээ',
    date: '2026.07.22',
    readMin: 6,
    region: 'domestic',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'ug-label-rise',
    title: 'UG лейблүүд: бие даасан хөгжмийн шинэ хүч',
    excerpt:
      'Том лейблээс гадуурх хамт олон хэрхэн өөрийн дистрибьюшн, мерч, контент экосистемээ бүтээж байна вэ?',
    body: `Бие даасан лейбл, crew-үүд сошиал медиа, Discord, Telegram-ыг ашиглан шууд фэнтэй холбогдож байна. Энэ нь дунд шатны артистуудад илүү их орлого, хяналт өгч байна.

Мерч, limited drop, collab бичлэг — эдгээр нь зөвхөн "нэмэлт орлого" биш, брэндийн гол хэсэг болжээ.`,
    category: 'Зах зээл',
    date: '2026.07.18',
    readMin: 5,
    region: 'domestic',
    image:
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'female-wave',
    title: 'Эмэгтэй рэпперийн долгион хүчээ авч байна',
    excerpt:
      'Шинэ нэрс, шинэ дууны өнгө — Монголын хип-хопт эмэгтэй артистуудын оролцоо мэдэгдэхүйц өсөв.',
    body: `Сүүлийн хоёр жилд эмэгтэй рэпперүүдийн гаргасан төслүүд стрим болон медиа анхаарлыг зэрэг авч байна. Энэ нь зөвхөн "шинэ" биш — зах зээлийн өнгө, сэдэв, үзэгчдийн бүтцийг өөрчилж байна.`,
    category: 'Соёл',
    date: '2026.07.12',
    readMin: 4,
    region: 'domestic',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'beat-economy',
    title: 'Бит зах зээл: producer-уудын үнэ хэрхэн тогтоогдож байна',
    excerpt:
      'Type beat-ээс custom beat хүртэл — үнийн бүтэц, эрхийн асуудал, орлогын загвар.',
    body: `Producer-ууд BeatStars, YouTube, Instagram-аар дамжуулан дэлхийн зах зээлд гарч байгаа ч дотоодын захиалгын үнэ, эрхийн гэрээний стандарт хараахан тогтоогүй байна. Newsac энэ сэдвээр цуврал шинжилгээ бэлтгэж байна.`,
    category: 'Бизнес',
    date: '2026.07.05',
    readMin: 7,
    region: 'domestic',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'global-chart-shift',
    title: 'Дэлхийн чарт: Afrobeats, Latin trap зах зээлийг хөдөлгөж байна',
    excerpt:
      'US/UK чартаас гадна глобал стриминг дээр шинэ жанрууд топ-ыг эзэлж — Монголын артистуудад юу хамаатай вэ?',
    body: `Spotify Global болон YouTube Music charts дээр Afrobeats, Latin trap, K-hip-hop улам хүчтэй байна. Энэ нь playlist curation болон algorithm-ийн өөрчлөлттэй холбоотой.

Монголын артистуудын хувьд: олон улсын collab, bilingual hook, diaspora audience — эдгээр нь дараагийн өсөлтийн цонх болж болно. Newsac гадаад зах зээлийн чиг хандлагыг долоо хоног бүр тоймлох болно.`,
    category: 'Global',
    date: '2026.07.28',
    readMin: 5,
    region: 'foreign',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'us-label-deals',
    title: 'US major label deal: 360 гэрээ юу гэсэн үг вэ?',
    excerpt:
      'Олон улсын лейблтэй гэрээ байгуулахдаа артистууд юуг анхаарах ёстой — товч гарын авлага.',
    body: `360 deal гэдэг нь лейбл зөвхөн бичлэг биш — touring, merch, brand deal-аас ч хувь авна гэсэн үг. Зарим тохиолдолд энэ нь карьерыг хурдасгана, заримдаа урт хугацаанд орлогыг хязгаарлана.

Гадаад зах зээлд гарахын өмнө: publishing, masters ownership, option period — гурвыг тодорхой болго. Newsac энэ сэдвээр дараагийн шинжилгээгээ бэлдэж байна.`,
    category: 'Industry',
    date: '2026.07.20',
    readMin: 6,
    region: 'foreign',
    image:
      'https://images.unsplash.com/photo-1598387993281-cecf8b11a1c5?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'kpop-comeback-tea',
    title: 'Comeback өмнөх «tea»: ямар мэдээ итгэх вэ?',
    excerpt:
      'K-pop мэдээний урсгалд юу баталгаатай, юу зөвхөн цууриа вэ — уншигчид анхаарах ёстой цэгүүд.',
    body: `Шинэ comeback ойртох бүрд X, Instagram, Telegram дээр мэдээ хурдан тардаг. Ихэнх нь эх сурвалжгүй, зарим нь PR-ийн intentional leak байдаг.

Newsac дээрх K-pop мэдээ нь: баталгаатай эх сурвалж, context, «цуурхал vs баримт» ялгааг тод харуулахыг зорьдог.

Дараагийн нийтлэлүүдэд agency schedule, chart, collab-ийг нэг дор тоймлох болно.`,
    category: 'K-pop',
    date: '2026.08.20',
    readMin: 3,
    region: 'kpop',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'kpop-dating-rumor',
    title: 'Dating rumor: фэнүүд юуг мэдэх ёстой вэ?',
    excerpt:
      'Артист dating цуурхал гарсан үед яаж унших, яаж хуваалцах — товч гарын авлага.',
    body: `Dating rumor ихэнхдээ paparazzi кадр эсвэл anonymous account-аас эхэлдэг. Нэг screenshot бүх түүхийг батлахгүй.

Шар мэдээ уншихдаа: эх сурвалж, огноо, agency хариу, өмнөх ижил цуурхлын түүх — эдгээрийг шалга. Newsac зөвхөн нийтийн ярианы context өгч, хувь хүний амьдралыг доромжлохгүй.

Хэрэв та энэ төрлийн мэдээ нэмэх/засах бол Admin → Мэдээ → Шар мэдээ.`,
    category: 'Gossip',
    date: '2026.08.18',
    readMin: 2,
    region: 'yellow',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80',
  },
]

export const videos: VideoItem[] = [
  {
    id: 'v1',
    youtubeId: 'KIvdyoHN2oc',
    title: 'БИДНИЙГ НААДАЖ БАЙХ ЗУУР...',
    description: 'Newsac — Монголын хип-хоп зах зээлийн шинэ тойм.',
    views: '68K',
    duration: '',
    published: '1 өдрийн өмнө',
  },
  {
    id: 'v2',
    youtubeId: '0THTfeMzZx8',
    title: 'ДЭЛХИЙН ЗАХ ЗЭЭЛ ДЭЭР ЮУ БОЛЖ БАЙНА ВЭ?!',
    description: 'Дэлхийн хип-хоп зах зээл дээрх гол үйл явдлууд.',
    views: '18K',
    duration: '',
    published: '7 хоногийн өмнө',
  },
  {
    id: 'v3',
    youtubeId: 'UryRJd1vWoY',
    title: 'НААДМААР ШИРҮҮХЭН ЗҮЙЛС БОЛЛОО!!!',
    description: 'Наадмын үеийн халуун сэдэв, зах зээлийн хөдөлгөөн.',
    views: '124K',
    duration: '',
    published: '12 хоногийн өмнө',
  },
  {
    id: 'v4',
    youtubeId: 'EpTCrO5BjiQ',
    title: 'АМЕРИК ХИП ХОП ЗАХ ЗЭЭЛ БУЖИГНАЖ БАЙНА!!!',
    description: 'Америкийн хип-хоп зах зээлийн ширүүн өөрчлөлтүүд.',
    views: '12K',
    duration: '',
    published: '3 долоо хоногийн өмнө',
  },
  {
    id: 'v5',
    youtubeId: 'Uh95xxhOrHg',
    title: 'ХИП ХОП ЗАХ ЗЭЭЛЭЭР СОНИН ЮУ БАЙНА?!',
    description: 'Долоо хоногийн хип-хоп зах зээлийн тойм.',
    views: '55K',
    duration: '',
    published: '3 долоо хоногийн өмнө',
  },
  {
    id: 'v6',
    youtubeId: 'dIhMXJG0wec',
    title: 'МОНГОЛЫН УРЛАГТ ЮУ БОЛООД БАЙНА?!',
    description: 'Монголын урлаг, хип-хопын одоогийн байдал.',
    views: '89K',
    duration: '',
    published: '1 сарын өмнө',
  },
]

export const rappers: Rapper[] = [
  {
    id: 'thunder',
    name: 'Thunder',
    aka: 'T.HNDR',
    city: 'Улаанбаатар',
    years: '2014 — одоо',
    bio: 'Хатуу delivery, street narrative-аар алдаршсан рэппер.',
    story:
      'Thunder анхны mixtape-ээ 2014 онд гаргасан. Эхний жилүүдэд зөвхөн UG тойрогт мэдэгдэж байсан ч 2019 оны "City Lights" төслөөрөө илүү өргөн үзэгчтэй болсон. Түүний дуунууд УБ-ын өдөр тутмын амьдрал, өрсөлдөөн, найз нөхдийн түүхийг шууд, чимэггүй өгүүлдэг.\n\nОдоо тэр өөрийн crew-тэй хамтран бие даасан лейбл хэлбэрээр ажиллаж, залуу рэпперүүдийг дэмжиж байна.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    tags: ['Boom bap', 'Street', 'UG'],
    streams: '4.2M',
    region: 'domestic',
    verified: true,
  },
  {
    id: 'luna',
    name: 'Luna Vee',
    aka: 'LV',
    city: 'Улаанбаатар',
    years: '2019 — одоо',
    bio: 'Melodic rap болон alternative дууны өнгө хослуулсан шинэ үеийн дуурай.',
    story:
      'Luna Vee TikTok болон YouTube Shorts-оор түргэн өссөн ч дараагийн алхамдаа бүрэн хэмжээний төсөл гаргаж, "viral artist"-аас "career artist" руу шилжихээ харуулсан. Түүний лирик сэтгэл зүй, харилцаа, хотын ганцаардлыг голчилдог.\n\n2025 оны EP нь эмэгтэй рэпперийн долгионыг бэхжүүлсэн гол бүтээлүүдийн нэгд тооцогдож байна.',
    image:
      'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=1000&q=80',
    tags: ['Melodic', 'Alt', 'New wave'],
    streams: '6.8M',
    region: 'domestic',
    verified: true,
  },
  {
    id: 'khaan',
    name: 'Khaan',
    aka: 'KH',
    city: 'Дархан',
    years: '2016 — одоо',
    bio: 'Дарханы UG-ээс гарсан, story-telling-ээрээ хүчтэй рэппер.',
    story:
      'Khaan Дархан хотын жижиг студиэс эхэлсэн. Түүний альбомнууд орон нутгийн амьдрал, шилжилт хөдөлгөөн, аз жаргал хайх сэдвийг гүнзгий авч үздэг. УБ-ын том тайзан дээр гарсан ч өөрийн хотынхноо мартаагүй гэдгээрээ фэнүүдийн хүндэтгэлийг хүлээсэн.\n\nТэр бас залууст зориулсан freestyle workshop зохион байгуулдаг.',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80',
    tags: ['Story', 'Conscious', 'Region'],
    streams: '3.1M',
    region: 'domestic',
  },
  {
    id: 'neon',
    name: 'NEON.88',
    aka: 'NEON',
    city: 'Улаанбаатар',
    years: '2021 — одоо',
    bio: 'Trap / hyperpop хүрээнд туршилт хийдэг шинэ нэр.',
    story:
      'NEON.88 болсон цагаасаа эхлэн дууны бүтэц, визуал, fashion-ыг нэг бренд болгон авч явсан. Залуу үзэгчдийн дунд маш хүчтэй бөгөөд стриминг платформ дээрх engagement өндөр.\n\nТүүний кейс бол "контент + хөгжим" хослол хэрхэн зах зээлд хурдан байр суурь эзэлдгийн жишээ.',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    tags: ['Trap', 'Hyper', 'Youth'],
    streams: '9.4M',
    region: 'domestic',
    verified: true,
  },
  {
    id: 'kendrick',
    name: 'Kendrick Lamar',
    aka: 'K.Dot',
    city: 'Compton, USA',
    years: '2003 — одоо',
    bio: 'Pulitzer шагналтай, modern hip-hop-ийн хамгийн нөлөөтэй дуурайнуудын нэг.',
    story:
      'Kendrick Lamar Compton-оос гарч, Top Dawg Entertainment-тай хамтран "Section.80", "good kid, m.A.A.d city", "To Pimp a Butterfly", "DAMN.", "Mr. Morale & the Big Steppers" зэрэг альбомоор жанрын стандартыг өөрчилсөн.\n\nТүүний лирик нь гэр бүл, итгэл, арьс өнгө, улс төрийн сэдвийг нэг өгүүлэмж болгон холбодог. 2018 онд "DAMN."-аар Pulitzer Prize авсан нь хип-хопын түүхэнд онцгой үйл явдал болсон.\n\nМонголын рэпперүүдэд түүний ач холбогдол: story-telling + concept album — зөвхөн singles биш, бүтэн төсөл гаргах соёлыг хүчтэй харуулсан.',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80',
    tags: ['Conscious', 'West Coast', 'Legend'],
    streams: '40B+',
    region: 'foreign',
    verified: true,
  },
  {
    id: 'drake',
    name: 'Drake',
    aka: 'Champagne Papi',
    city: 'Toronto, Canada',
    years: '2006 — одоо',
    bio: 'Melodic rap болон streaming эриний дүрмийг тодорхойлсон глобал суперстар.',
    story:
      'Drake Toronto-оос гарч, acting-ээс хөгжим рүү шилжсэн. "Take Care", "Nothing Was the Same", "Views", "Scorpion" зэрэг төслөөрээ R&B болон rap-ыг нэг урсгал болгосон.\n\nТэр playlist culture, guest feature эдийн засаг, OVO брэндийг глобал хэмжээнд авч явсан. Стриминг дээрх рекорд, chart domination нь орчин үеийн хип-хоп бизнесийн загвар болсон.\n\nNewsac үзэгчдэд: melodic hook + consistent release — залуу артистууд яагаад "дууны өнгө" чухал гэж ярьдгийн тод жишээ.',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    tags: ['Melodic', 'Pop-rap', 'Global'],
    streams: '50B+',
    region: 'foreign',
    verified: true,
  },
  {
    id: 'travis',
    name: 'Travis Scott',
    aka: 'La Flame',
    city: 'Houston, USA',
    years: '2012 — одоо',
    bio: 'Rage sound, визуал ертөнц, live experience-ээрээ алдаршсан.',
    story:
      'Travis Scott Houston-оос гарч, "Rodeo", "Birds in the Trap", "Astroworld", "Utopia" альбомоорөө trap-ийн дуу чимээ, тайзны соёлыг өөрчилсөн. Cactus Jack лейбл, fashion collab, festival headliner статус нь хөгжмийг lifestyle бренд болгосон.\n\nТүүний live show — гэрэл, crowd energy, production — контент болон туршлагыг нэгтгэсэн орчин үеийн жишээ.\n\nМонголын артистуудад: sound design + visual identity + drop culture хэрхэн нэг экосистем болдгийг харуулна.',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80',
    tags: ['Trap', 'Rage', 'Festival'],
    streams: '30B+',
    region: 'foreign',
    verified: true,
  },
  {
    id: 'nicki',
    name: 'Nicki Minaj',
    aka: 'Onika',
    city: 'Queens, USA',
    years: '2007 — одоо',
    bio: 'Эмэгтэй рэппийн коммерциал болон техникийн стандартыг тогтоосон дүрс.',
    story:
      'Nicki Minaj Trinidad/Queens гаралтай, Young Money үедээ дэлхийд гарсан. "Pink Friday" цуврал, alter ego-ууд, punchline-heavy verse-үүд нь эмэгтэй рэппийн mainstream хаалгыг өргөжүүлсэн.\n\nТэр зөвхөн рэп биш — pop crossover, fashion, fandom culture (Barbz)-ыг бүрэн бренд болгосон. Chart battle, feature economy дээрх нөлөө нь өнөөг хүртэл үргэлжилнэ.\n\nNewsac-ийн эмэгтэй рэпперийн долгионтой холбоо: техникийн ур чадвар + persona + бизнес нэг дор явж болдгийн жишээ.',
    image:
      'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=1000&q=80',
    tags: ['Bars', 'Pop-rap', 'Icon'],
    streams: '25B+',
    region: 'foreign',
    verified: true,
  },
  {
    id: 'jcole',
    name: 'J. Cole',
    aka: 'Cole',
    city: 'Fayetteville, USA',
    years: '2007 — одоо',
    bio: 'Dreamville лейблтэй, story-telling болон бие даасан замаараа хүндлэгддэг.',
    story:
      'J. Cole Fayetteville-ээс гарч, "2014 Forest Hills Drive", "KOD", "The Off-Season", "The Fall Off" хүлээлттэй төслөөрөө алдаршсан. Ихэнх бүтээлээ өөрөө продюсерлэж, лейбл системийн гаднах бие даасан байдлыг харуулсан.\n\nDreamville — The Festival, Rising artists — залуу артистуудыг өсгөх загвар. Түүний дуунууд гэр бүл, мөнгө, fame-ийн дарамт, найз нөхөд гэсэн сэдвийг шууд ярьдаг.\n\nМонголын UG-д: өөрийн лейбл/crew байгуулж, урт хугацааны карьер барих жишээ болгон харж болно.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    tags: ['Story', 'Boom bap', 'Independent'],
    streams: '20B+',
    region: 'foreign',
    verified: true,
  },
  {
    id: 'sza-adjacent-tyler',
    name: 'Tyler, The Creator',
    aka: 'Tyler',
    city: 'Los Angeles, USA',
    years: '2007 — одоо',
    bio: 'Odd Future-ээс гарсан, genre-г үл тоомсорлож бүтээл хийдэг innovator.',
    story:
      'Tyler, The Creator Odd Future crew-ээр эхэлж, "Goblin", "Flower Boy", "Igor", "Call Me If You Get Lost", "Chromakopia" зэрэг төслөөрөө хип-хоп, R&B, alternative-ыг нэгтгэсэн.\n\nТэр fashion (Golf Wang), visual direction, album rollout-ыг урлагийн бүтээл мэт авч үздэг. Grammy шагналууд, festival headliner статус нь "weird" байх нь зах зээлд саад биш гэдгийг баталсан.\n\nЗалуу артистуудад: өөрийн гоо зүйгээ барих — чиг хандлага хуулбарлахаас илүү өвөрмөц дуу хоолой чухал.',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    tags: ['Alt', 'Creative', 'West Coast'],
    streams: '15B+',
    region: 'foreign',
    verified: true,
  },
]

export const rankings: RankItem[] = [
  { id: '1', name: 'NEON.88', track: 'Midnight Run', score: 94, change: 2, streams: '1.2M' },
  { id: '2', name: 'Luna Vee', track: 'Glass City', score: 91, change: 0, streams: '980K' },
  { id: '3', name: 'Thunder', track: 'No Signal', score: 88, change: -1, streams: '870K' },
  { id: '4', name: 'Khaan', track: 'Northbound', score: 84, change: 3, streams: '640K' },
  { id: '5', name: 'Crew X', track: 'Block Anthem', score: 81, change: 1, streams: '590K' },
  { id: '6', name: 'Mira', track: 'Soft Flex', score: 79, change: -2, streams: '520K' },
  { id: '7', name: 'Batu', track: 'Cashflow', score: 76, change: 4, streams: '480K' },
  { id: '8', name: 'Void', track: 'Echo Chamber', score: 74, change: 0, streams: '430K' },
]
