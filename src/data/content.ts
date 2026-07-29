export type NewsItem = {
  id: string
  title: string
  excerpt: string
  body: string
  category: string
  date: string
  readMin: number
  image: string
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
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80',
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
