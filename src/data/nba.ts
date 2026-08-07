export type NbaStory = {
  id: string
  tag: string
  title: string
  blurb: string
  body: string[]
  when: string
  readMin: number
  image: string
}

export type NbaHot = {
  id: string
  rank: number
  title: string
  team: string
  heat: string
  blurb: string
  body: string[]
  readMin: number
}

export type FreeAgent = {
  id: string
  rank: number
  name: string
  position: string
  lastTeam: string
  age: string
  note: string
  detail: string[]
  fit: string
}

export type QuizQ = {
  id: string
  q: string
  choices: string[]
  answer: number
  explain: string
}

export const nbaUpdates: NbaStory[] = [
  {
    id: 'u1',
    tag: 'Trade',
    title: 'Зүүн конференцийн худалдааны цонх халуун байна',
    blurb:
      'Playoff seed-ийн төлөө contender-үүд wing болон big нэмэхээр хөдөлж байна. Deadline ойртох тусам phone line намжихгүй.',
    body: [
      'Зүүн талд 6–10-р байрын зөрүү маш жижиг болсон. Ийм үед нэг л trade багийн identity-г өөрчилж чадна: 3&D wing нэмэх үү, эсвэл rim protection-оо бэхжүүлэх үү?',
      'Cap sheet болон draft capital-ийн хослол чухал. Зарим баг “win-now” горимд шилжиж, future pick-ээ зарж байна. Нөгөө хэсэг нь seller-ээр үлдэж, young talent цуглуулж байна.',
      'Newsac-ийн уншигчдад зөвлөе: зөвхөн нэрийг биш — contract years, injury history, fit-ийг хамт хар. Том нэр болгон шийдэл биш.',
    ],
    when: '2 цагийн өмнө',
    readMin: 4,
    image:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'u2',
    tag: 'Injury',
    title: 'Оддын load management — долоо хоногийн тайлан',
    blurb:
      'Гол тоглогчдын minutes restriction, буцах хуваарь, playoff-ын өмнөх “ramping up” төлөвлөгөө.',
    body: [
      'Улирлын төгсгөлд health > standings гэсэн үзэл баримтлал хүчтэй. Зарим од back-to-back-ээс чөлөөлөгдөж, зарим нь minutes 28–32 дотор тоглож байна.',
      'Training staff-ийн мэдээг дагах нь чухал: “questionable” гэдэг үг өдөр бүр өөр утгатай байж болно. Буцах өдөр биш, буцах хэлбэр (minutes, role) илүү чухал.',
      'Фэнүүдийн хувьд: fantasy/lineup-аас илүү урт хугацааны зураг. Баг playoff-д орвол эдгээр шийдвэр зөв байсныг харна.',
    ],
    when: '5 цагийн өмнө',
    readMin: 3,
    image:
      'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'u3',
    tag: 'Draft',
    title: 'Дараагийн драфтын mock: #1 pick хэн бэ?',
    blurb:
      'Scouts-ийн санал, workout clip, багийн хэрэгцээ — гурвыг нь нийлүүлж харвал board өөрчлөгдөнө.',
    body: [
      'Одоогийн consensus-д #1-д big-ийн нэр давамгайлж байна. Гэхдээ guard-heavy draft class гэдэг яриа ч хүчтэй.',
      'Workout-ууд дээр shooting consistency болон switch defense хамгийн их асуулттай. Athleticism ганцаараа board-ыг өргөхгүй.',
      'Жижиг зах зээлтэй багууд “safe two-way” сонгох хандлагатай. Big market contender-үүд trade-up яриа эхлүүлж болно.',
    ],
    when: 'Өчигдөр',
    readMin: 5,
    image:
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'u4',
    tag: 'Intl',
    title: 'Олон улсын лигээс NBA руу — шинэ нэрс',
    blurb:
      'EuroLeague / G League bridge-ээр ирэх хөгжилтэй тоглогчид. Spacing болон IQ-г импортлож байна.',
    body: [
      'Олон улсын тоглогчид NBA-д илүү хурдан дасан зохицож байна — physicality-ээс илүү decision speed чухал болсон.',
      'EuroLeague-ийн stretch big болон secondary creator-ууд contender-үүдийн shortlist-д орсон. Two-way contract → roster spot зам нээлттэй.',
      'Монголын үзэгчдэд: highlights-аас гадна full game film үз. Passing vision болон off-ball movement эндээс илүү тод харагдана.',
    ],
    when: '2 өдрийн өмнө',
    readMin: 4,
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'u5',
    tag: 'Analysis',
    title: 'Pace & space: яагаад 3 оноо тоглолтыг өөрчилсөн бэ?',
    blurb:
      'Corner three, 5-out offense, drop coverage — энгийн харагдах зүйлс яагаад championship-ийг шийддэг вэ?',
    body: [
      'Орчин үеийн NBA-д possession бүрийн expected value чухал. Corner three бол хамгийн үнэтэй “энгийн” шийдвэрүүдийн нэг.',
      'Big-үүд rim-ээс холдож spacing өгөхөд lane нээгдэнэ. Guard-ууд paint рүү орох зайтай болж, kick-out нэмэгдэнэ.',
      'Defense талд drop vs switch сонголт багийн identity. Амжилттай багууд нэг схемийг төгс хийхээс илүү, тоглолтын дундуур солих чадвартай.',
    ],
    when: '3 өдрийн өмнө',
    readMin: 6,
    image:
      'https://images.unsplash.com/photo-1608245449230-4ac190afb580?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'u6',
    tag: 'Culture',
    title: 'Шөнө дундын NBA: Улаанбаатарын үзэгчийн гарын авлага',
    blurb:
      'UB цагаар хэзээ тоглолт эхлэх вэ, аль stream дээр highlight хамгийн хурдан гарах вэ, хэрхэн “alive” мэдрэх вэ.',
    body: [
      'Ихэнх prime-time тоглолт UB-д өглөө эрт эсвэл шөнө дунд ордог. Тиймээс community chat, short recap, next-day analysis чухал.',
      'Newsac дээр бид зөвхөн оноо биш — контекст өгдөг: яагаад coach timeout авсан, яагаад lineup өөрчлөгдсөн.',
      'Зөвлөмж: бүтэн тоглолт үзэх боломжгүй бол 4-р үе + postgame. Тэнд л story төгсдөг.',
    ],
    when: '4 өдрийн өмнө',
    readMin: 3,
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=1200&q=80',
  },
]

export const nbaHotNews: NbaHot[] = [
  {
    id: 'h1',
    rank: 1,
    title: 'Finals MVP race эрт эхэллээ',
    team: 'League-wide',
    heat: 'MAX',
    blurb: 'Regular season MVP-ээс өөр түүх — clutch possession болон dual-threat impact.',
    body: [
      'Finals MVP нь зөвхөн оноо биш. Defense, playmaking, “closing lineups”-д хэн үлдэнэ гэдэг шийддэг.',
      'Энэ жилийн race-д 2–3 нэр эрт яригдаж байна. Гэхдээ May/June-д бүх зүйл өөрчлөгдөнө.',
    ],
    readMin: 3,
  },
  {
    id: 'h2',
    rank: 2,
    title: 'Superteam rumor: гурав дахь одны яриа',
    team: 'West',
    heat: 'HIGH',
    blurb: 'Star + star + star. Cap math хэцүү ч rumor machine намжихгүй.',
    body: [
      'West-ийн нэг contender гурав дахь од нэмэхээр agent-үүдтэй ярьж байна гэсэн мэдээ гарав.',
      'Бодит байдал: salary matching + draft capital. Том deal болгонд “role players” ч багтдаг.',
    ],
    readMin: 2,
  },
  {
    id: 'h3',
    rank: 3,
    title: 'Rookie of the Year — дунд улирлын leaderboard',
    team: 'Rookies',
    heat: 'HIGH',
    blurb: 'Usage өссөн, efficiency хадгалсан нэрс түрүүлж явна.',
    body: [
      'ROY race-д scoring burst ганцаараа хангалтгүй. On/off rating, defense, availability чухал.',
      'Зарим rookie “all-star trajectory” харуулж байна — гэхдээ sophomore year жинхэнэ шалгуур.',
    ],
    readMin: 2,
  },
  {
    id: 'h4',
    rank: 4,
    title: 'Coach’s challenge rule өөрчлөлт',
    team: 'NBA Ops',
    heat: 'MID',
    blurb: 'Timeout + challenge combo coach-уудын стратегид нөлөөлнө.',
    body: [
      'Шинэ clarification-ийн дараа late-game challenge илүү болгоомжтой болно.',
      'Фэнүүдэд: replay дэлгэц удаан харагдах нь нормал — алдаа багасгахын тулд.',
    ],
    readMin: 2,
  },
  {
    id: 'h5',
    rank: 5,
    title: 'All-Defense snub яриа эхэллээ',
    team: 'Voters',
    heat: 'MID',
    blurb: 'Highlight steal vs team defense — хэн илүү “real” defender вэ?',
    body: [
      'Voters narrative болон advanced metrics зөрөх үед маргаан гардаг.',
      'Newsac take: counting stats + film. Хоёулангүйгээр шударга биш.',
    ],
    readMin: 2,
  },
]

export const mambaMentality = {
  title: 'Mamba Mentality гэж юу вэ?',
  kicker: 'Kobe Bryant',
  lead:
    'Ялагч байхын тулд өдөр бүр өөртэйгөө тулалдах — Kobe-ийн амьдрал, ажил, спортын философи. Энэ бол зөвхөн slogan биш, өдөр тутмын систем.',
  story: [
    'Kobe “Mamba Mentality”-г өөрийнхөө ажлын хэв маягийг тайлбарлахдаа хэрэглэсэн. Гол санаа: хамгийн хэцүү мөчид хамгийн сайн хувилбараа гаргах.',
    'Тэр бэлтгэл дээр өрсөлдөгчөөсөө илүү эрт ирж, илүү олон repetition хийдэг байсан. Авъяас чухал — гэхдээ process илүү чухал.',
    'Амьдралд энэ mindset зөвхөн basketball-д биш: сургууль, ажил, урлагт ч хэрэглэгдэнэ. Алдаагаа нуух биш, засч, дараагийн “possession”-д шилжих.',
  ],
  points: [
    {
      h: 'Obsessive craft',
      p: 'Жижиг зүйлс: footwork, free throw, film session — бүгдийг мэргэжлийн түвшинд хийх. Дэлгэрэнгүй: нэг skill-ийг “хангалттай” гэж үзэхгүй.',
    },
    {
      h: 'Fearless focus',
      p: 'Алдаанаас айхгүй. Дарамттай мөчид илүү тайван, илүү хурц байх. Fear нь мэдээлэл — түүнийг action болго.',
    },
    {
      h: 'Next play',
      p: 'Алдаа болсон — дараагийн possession. Өнгөрсөнд гацахгүй, урагшаа. Short memory + long vision.',
    },
    {
      h: 'Outwork everyone',
      p: 'Авъяас ганцаараа хангалтгүй. Бэлтгэл, сэргэлт, mindset — 24/7. Recovery ч training-ийн нэг хэсэг.',
    },
  ],
  quote:
    '«Everything negative — pressure, challenges — is all an opportunity for me to rise.»',
  takeaway:
    'Newsac дээр Mamba гэдэг нь “илүү хичээ” гэсэн хоосон үг биш. Энэ нь: төлөвлө, хэмж, зас, дахин хий — өдөр бүр.',
}

export const freeAgents: FreeAgent[] = [
  {
    id: 'fa1',
    rank: 1,
    name: 'Elite Wing Scorer',
    position: 'SF / PF',
    lastTeam: 'Contender',
    age: '27',
    note: '3&D + isolation. Max-level market.',
    detail: [
      'On-ball creation болон weak-side 3-ийн хослол contender-үүдэд хамгийн дутагдалтай.',
      'Гэрээний хүлээлт: multi-year, near-max. Fit: spacing-тай big-тэй баг.',
    ],
    fit: 'Win-now West / East 2–4 seed',
  },
  {
    id: 'fa2',
    rank: 2,
    name: 'Two-Way Guard',
    position: 'PG / SG',
    lastTeam: 'Playoff team',
    age: '26',
    note: 'Pick & roll engine, clutch minutes.',
    detail: [
      'Half-court offense-ийг зохион байгуулах чадвартай. Late-clock solution.',
      'Defense дээр point-of-attack — энэ л үнийг өсгөнө.',
    ],
    fit: 'Star-аас secondary creator хэрэгтэй баг',
  },
  {
    id: 'fa3',
    rank: 3,
    name: 'Rim Protector',
    position: 'C',
    lastTeam: 'East',
    age: '29',
    note: 'Switchable big, short-roll threat.',
    detail: [
      'Paint deterrence + short roll pass. Modern C-ийн стандарт.',
      'Age 29 ч playoff-д “stabilizer” үүрэг гүйцэтгэнэ.',
    ],
    fit: 'Perimeter-heavy contender',
  },
  {
    id: 'fa4',
    rank: 4,
    name: 'Stretch Big',
    position: 'PF / C',
    lastTeam: 'West',
    age: '28',
    note: 'Spacing + offensive rebound.',
    detail: [
      'Corner/slot 3 + offensive glass. Small-ball 5 болж чадна.',
      'Contract: mid-level эсвэл soft max — market гүнээс хамаарна.',
    ],
    fit: 'Pace & space system',
  },
  {
    id: 'fa5',
    rank: 5,
    name: 'Veteran Leader',
    position: 'SG',
    lastTeam: 'Multiple stops',
    age: '33',
    note: 'Locker room + playoff IQ.',
    detail: [
      'Minutes бага ч “correct play”-ийг мэддэг. Young core-той багт үнэтэй.',
      '1+1 эсвэл short deal илүү бодитой.',
    ],
    fit: 'Rising young roster',
  },
  {
    id: 'fa6',
    rank: 6,
    name: '3&D Specialist',
    position: 'SF',
    lastTeam: 'Finals team',
    age: '30',
    note: 'Corner sniper, weak-side help.',
    detail: [
      'Role тодорхой: shoot, defend, don’t turn over. Championship glue.',
      'Үнэ нь “quiet” — гэхдээ playoff series-д мэдрэгдэнэ.',
    ],
    fit: 'Any contender wing depth',
  },
]

export const sacfunBits = [
  {
    id: 's1',
    title: 'Sacfun Court',
    text: 'Highlight reaction, bold prediction, hot take — Newsac community-тай нэг court дээр. Долоо хоног бүр нэг “Court King” take сонгоно.',
  },
  {
    id: 's2',
    title: 'Pick’em Night',
    text: 'Өнөөдрийн board: хэн ялах вэ, хэн 30+ авна вэ? Найзтайгаа score хөтөл. Ялагч дараагийн Quiz-д bonus авна (удахгүй).',
  },
  {
    id: 's3',
    title: 'Mongol take',
    text: 'UB цагаар шөнө дунд тоглолт — coffee + clutch. Таны hottest take-ээ Wall эсвэл YouTube comment дээр үлдээгээрэй.',
  },
  {
    id: 's4',
    title: 'Clip of the week',
    text: 'Долоо хоногийн хамгийн гоё play-г Newsac YouTube дээр break down хийнэ. Comment-ээр нэр дэвшүүл.',
  },
]

export const nbaYtVideos = [
  {
    id: 'yt1',
    title: 'NBA шинийн тойм · Newsac',
    note: 'Долоо хоногийн хамгийн чухал story-г Монгол хэлээр',
  },
  {
    id: 'yt2',
    title: 'Mamba Mentality · яриа',
    note: 'Mindset + highlight + community Q&A',
  },
  {
    id: 'yt3',
    title: 'Free Agency board',
    note: 'Хэн хаашаа очих вэ — cap sheet-тэй тайлбар',
  },
]

export const nbaQuiz: QuizQ[] = [
  {
    id: 'q1',
    q: 'NBA-д нэг баг хэдэн тоглогчтой roster байдаг вэ (стандарт)?',
    choices: ['12', '15', '18', '10'],
    answer: 1,
    explain: 'Стандарт active roster 15 (two-way-ийг оруулаад яриа өөр).',
  },
  {
    id: 'q2',
    q: 'Kobe Bryant аль багт бүх карьераа өнгөрөөсөн бэ?',
    choices: ['Chicago Bulls', 'Los Angeles Lakers', 'Boston Celtics', 'Miami Heat'],
    answer: 1,
    explain: 'Kobe бүх 20 улирлаа Lakers-т өнгөрөөсөн.',
  },
  {
    id: 'q3',
    q: 'Shot clock хэдэн секунд вэ?',
    choices: ['18', '20', '24', '30'],
    answer: 2,
    explain: 'NBA shot clock 24 секунд.',
  },
  {
    id: 'q4',
    q: 'Finals MVP шагнал юу гэж нэрлэгддэг вэ?',
    choices: ['Larry O’Brien', 'Bill Russell', 'Magic Johnson', 'Naismith'],
    answer: 1,
    explain: 'Finals MVP = Bill Russell Trophy. Larry O’Brien бол багийн аваргаллын цом.',
  },
  {
    id: 'q5',
    q: 'Нэг үед хэдэн тоглогч талбай дээр байдаг вэ (нэг баг)?',
    choices: ['4', '5', '6', '7'],
    answer: 1,
    explain: 'Баг бүр 5 тоглогчтой — нийт 10.',
  },
  {
    id: 'q6',
    q: 'Гурван онооны шугам ойролцоогоор хэдэн фут вэ (top of arc)?',
    choices: ['19.75', '22', '23.75', '25'],
    answer: 2,
    explain: 'NBA 3PT шугам top of the key орчим 23.75 фут.',
  },
]
