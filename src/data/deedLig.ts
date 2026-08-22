import type { DeedLigClub, DeedLigFreeAgent, DeedLigPlayer } from '../store/types'

export const seedDeedLigClubs: DeedLigClub[] = [
  { id: 'knights', name: 'BCH Найтс', city: 'Улаанбаатар', arena: 'UG Arena' },
  { id: 'khuleguud', name: 'Хасын Хүлэгүүд', city: 'Улаанбаатар' },
  { id: 'apes', name: 'SG Эйпс', city: 'Улаанбаатар' },
  { id: 'miners', name: 'Омни Эрдэнэт Майнерс', city: 'Эрдэнэт' },
  { id: 'bodons', name: 'Сэлэнгэ Бодонс', city: 'Сэлэнгэ' },
  { id: 'shonkhoruud', name: 'Хаан Шонхорууд', city: 'Ховд' },
  { id: 'darkhan', name: 'Дархан Юнайтед', city: 'Дархан' },
  { id: 'brothers', name: 'Завхан Бродерс', city: 'Завхан' },
  { id: 'mongolians', name: 'Монголианс', city: 'Улаанбаатар' },
  { id: 'metal', name: 'Бишрэлт Металл', city: 'Улаанбаатар' },
]

export const seedDeedLigPlayers: DeedLigPlayer[] = []

export const seedDeedLigFreeAgents: DeedLigFreeAgent[] = [
  {
    id: 'dl-fa-1',
    rank: 1,
    name: 'Б. Болд',
    position: 'PG',
    lastTeam: 'Хасын Хүлэгүүд',
    newTeam: '',
    age: '27',
    height: '188 см',
    weight: '82 кг',
    image: '',
    note: 'Гэрээ дууссан · playmaking + midrange',
    detail: [
      'Лигийн шилдэг playmaker-үүдийн нэг. PnR, late-clock shot-making.',
      'Багууд secondary creator хайж байгаа бол тэргүүн мөрөнд.',
    ],
    fit: 'Найтс / Эйпс — on-ball creation',
  },
  {
    id: 'dl-fa-2',
    rank: 2,
    name: 'Т. Төмөр',
    position: 'C',
    lastTeam: 'Омни Эрдэнэт Майнерс',
    newTeam: '',
    age: '29',
    height: '208 см',
    weight: '105 кг',
    image: '',
    note: 'Rim protection · rebounding',
    detail: [
      'Paint deterrence, offensive glass. Minutes тогтвортой байсан.',
      'Frontcourt size хэрэгтэй багуудад богино гэрээгээр ч тохирно.',
    ],
    fit: 'Бодонс / Металл — paint + glass',
  },
]
