export const YOUTUBE_CHANNELS = [
  {
    id: 'UC_eA572lBzVkpXhoeWnqSKQ',
    name: 'QUEI DUE SUL SERVER QDSS',
    description: ' Qui potrai goderti una marea di gameplay e recensioni',
    isDefault: true
  },
  {
    id: 'UCaKfZCvI_HaVyPmnDpiuK8Q',
    name: 'GOGAMESGUIDE',
    description: 'Guide, Walkthrough, Tutorial',
    isDefault: false
  },
  {
    id: 'UC45NqhCJKpUzj6vkP6buBYQ',
    name: 'FALCONERO',
    description: 'Un canale dedicato ai videogiochi 100% ',
    isDefault: false
  },
  {
    id: 'UCsgv2QHkT2ljEixyulzOnUQ',
    name: 'ANGRYJOESHOW',
    description: 'Just one Guys Opinion on Games, Movies & Geek Stuff.',
    isDefault: false
  }
];

export const DEFAULT_CHANNEL_ID = YOUTUBE_CHANNELS.find(ch => ch.isDefault)?.id || 'UCfWKwWWO9LT965F0pYMb7fQ';