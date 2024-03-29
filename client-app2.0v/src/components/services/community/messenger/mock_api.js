import { v4 as uuidv4 } from 'uuid';
import { dotCase } from 'change-case';
import { isEmpty, sample, xor } from 'lodash';
import { sub, addDays } from 'date-fns';
import mockData from '../../../../utils/mock-data';

// ----------------------------------------------------------------------

export const MY_CONTACT = {
  id: '8864c717-587d-472a-929a-8e5f298024da-0',
  avatar: '/static/mock-images/avatars/avatar_15.jpg',
  name: 'Jaydon Frankie',
  username: 'jaydon.frankie'
};

// ----------------------------------------------------------------------

export const contacts = [...Array(20)].map((_, index) => ({
  id: mockData.id(index),
  name: mockData.name.fullName(index),
  username: mockData.name.fullName(index) && dotCase(mockData.name.fullName(index)),
  avatar: mockData.image.avatar(index),
  address: mockData.address.fullAddress(index),
  phone: mockData.phoneNumber(index),
  email: mockData.email(index),
  lastActivity: mockData.time(index),
  status: sample(['online', 'offline', 'away', 'busy']) || 'online',
  position: mockData.role(index)
}));

export const conversations = { byId: {}, allIds: [] };
const conversationData = [
  {
    id: mockData.id(1),
    participants: [MY_CONTACT, contacts[1]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(1),
        contentType: 'text',
        attachments: [mockData.image.feed(1)],
        createdAt: sub(new Date(), { hours: 10 }),
        senderId: contacts[1].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(2),
        contentType: 'text',
        attachments: [mockData.image.feed(2)],
        createdAt: sub(new Date(), { hours: 2 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(3),
        contentType: 'text',
        attachments: ['/static/mock-images/avatars/avatar_12.mp4'],
        createdAt: sub(new Date(), { minutes: 8 }),
        senderId: contacts[1].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(4),
        contentType: 'text',
        attachments: [
          'https://mail.google.com/mail/u/file1.docx',
          'https://mail.google.com/mail/u/file2.xlsx',
          'https://mail.google.com/mail/u/file3.pptx'
        ],
        createdAt: sub(new Date(), { minutes: 6 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(5),
        contentType: 'text',
        attachments: [
          'https://mail.google.com/mail/u/file4.pdf',
          'https://mail.google.com/mail/u/file5.psd',
          'https://mail.google.com/mail/u/file6.esp',
          'https://mail.google.com/mail/u/file7.sketch'
        ],
        createdAt: sub(new Date(), { minutes: 4 }),
        senderId: contacts[1].id
      },
      {
        id: uuidv4(),
        attachments: [],
        contentType: 'image',
        body: mockData.image.feed(4),
        createdAt: sub(new Date(), { minutes: 2 }),
        senderId: contacts[1].id
      },
      {
        id: uuidv4(),
        contentType: 'text',
        body: mockData.text.sentence(6),
        attachments: [],
        createdAt: sub(new Date(), { minutes: 2 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(7),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 2 }),
        senderId: MY_CONTACT.id
      }
    ]
  },
  {
    id: mockData.id(2),
    participants: [MY_CONTACT, contacts[2]],
    type: 'ONE_TO_ONE',
    unreadCount: 2,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(8),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 8 }),
        senderId: contacts[2].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(9),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 6 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(10),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 4, minutes: 30 }),
        senderId: contacts[2].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(11),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 2, minutes: 15 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(12),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 1, minutes: 15 }),
        senderId: contacts[2].id
      },
      {
        id: uuidv4(),
        body: mockData.image.feed(7),
        attachments: [],
        contentType: 'image',
        createdAt: sub(new Date(), { hours: 1 }),
        senderId: contacts[2].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(13),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 45 }),
        senderId: MY_CONTACT.id
      }
    ]
  },
  {
    id: mockData.id(3),
    participants: [MY_CONTACT, contacts[3]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(14),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 8 }),
        senderId: contacts[3].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(15),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 6 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(16),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 4, minutes: 30 }),
        senderId: contacts[3].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(17),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 2, minutes: 15 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(18),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 1, minutes: 15 }),
        senderId: contacts[3].id
      },
      {
        id: uuidv4(),
        body: mockData.image.feed(5),
        contentType: 'image',
        attachments: [],
        createdAt: sub(new Date(), { hours: 1 }),
        senderId: contacts[3].id
      },
      {
        id: uuidv4(),
        body: mockData.image.feed(6),
        contentType: 'image',
        attachments: [],
        createdAt: sub(new Date(), { hours: 1 }),
        senderId: contacts[3].id
      }
    ]
  },
  {
    id: mockData.id(4),
    participants: [MY_CONTACT, contacts[4]],
    type: 'ONE_TO_ONE',
    unreadCount: 2,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(19),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 10 }),
        senderId: contacts[4].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(20),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { hours: 2 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(21),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 5 }),
        senderId: contacts[4].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(22),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 3 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(23),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(24),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[4].id
      }
    ]
  },
  {
    id: mockData.id(5),
    participants: [MY_CONTACT, contacts[5]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(25),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(26),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[5].id
      }
    ]
  },
  {
    id: mockData.id(6),
    participants: [MY_CONTACT, contacts[6]],
    type: 'ONE_TO_ONE',
    unreadCount: 2,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(27),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(28),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[6].id
      }
    ]
  },
  {
    id: mockData.id(7),
    participants: [MY_CONTACT, contacts[1], contacts[2], contacts[4], contacts[3]],
    type: 'GROUP',
    unreadCount: 5,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(29),
        contentType: 'text',
        attachments: [
          mockData.image.feed(1),
          mockData.image.feed(2),
          mockData.image.feed(3),
          mockData.image.feed(4),
          'https://mail.google.com/mail/u/file1.docx'
        ],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 30 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(30),
        contentType: 'text',
        attachments: ['https://mail.google.com/mail/u/file2.xlsx'],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 29 }),
        senderId: contacts[1].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(31),
        contentType: 'text',
        attachments: ['https://mail.google.com/mail/u/file3.psd'],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 28 }),
        senderId: contacts[2].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(32),
        contentType: 'text',
        attachments: ['https://mail.google.com/mail/u/file3.pptx'],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 27 }),
        senderId: contacts[4].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(33),
        contentType: 'text',
        attachments: ['https://mail.google.com/mail/u/file3.ai'],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 26 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(34),
        contentType: 'text',
        attachments: ['https://mail.google.com/mail/u/file3.mp4'],
        createdAt: sub(new Date(), { days: 3 }),
        senderId: contacts[3].id
      }
    ]
  },
  {
    id: mockData.id(8),
    participants: [MY_CONTACT, contacts[7]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(35),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(1),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[7].id
      }
    ]
  },
  {
    id: mockData.id(9),
    participants: [MY_CONTACT, contacts[8]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(2),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(3),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[8].id
      }
    ]
  },
  {
    id: mockData.id(10),
    participants: [MY_CONTACT, contacts[9]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(4),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(5),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[9].id
      }
    ]
  },
  {
    id: mockData.id(11),
    participants: [MY_CONTACT, contacts[6], contacts[7], contacts[8], contacts[9], contacts[10]],
    type: 'GROUP',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(6),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 30 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(7),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 29 }),
        senderId: contacts[9].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(8),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 28 }),
        senderId: contacts[10].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(9),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 27 }),
        senderId: contacts[8].id
      },
      {
        id: uuidv4(),
        attachments: [],
        body: mockData.text.sentence(10),
        contentType: 'text',
        createdAt: sub(new Date(), { days: 3, hours: 2, minutes: 26 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(11),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { days: 3 }),
        senderId: contacts[6].id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(12),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { days: 3 }),
        senderId: contacts[7].id
      }
    ]
  },
  {
    id: mockData.id(12),
    participants: [MY_CONTACT, contacts[10]],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: uuidv4(),
        body: mockData.text.sentence(13),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: MY_CONTACT.id
      },
      {
        id: uuidv4(),
        body: mockData.text.sentence(14),
        contentType: 'text',
        attachments: [],
        createdAt: sub(new Date(), { minutes: 1 }),
        senderId: contacts[10].id
      }
    ]
  }
];

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

conversations.byId = objFromArray(conversationData);
conversations.allIds = Object.keys(conversations.byId);
// ----------------------------------------------------------------------

const memberIds = {
  member1: '473d2720-341c-49bf-94ed-556999cf6ef7',
  member2: 'b8395203-887c-46f5-a85f-339b2d75c98b',
  member3: '048f6343-7a65-4873-a570-eb6ff4eb1ba3',
  member4: '18e23ac9-c874-43e4-8163-2d37f15f3367',
  member5: 'a3be5485-03bf-47a6-b553-a9cf9f070ed8'
};
export const assignee = [{ id: memberIds.member1, avatar: mockData.image.avatar(1), name: mockData.name.fullName(1) }];
