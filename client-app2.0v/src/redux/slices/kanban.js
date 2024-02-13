import { createSlice } from '@reduxjs/toolkit';
import { omit } from 'lodash';
import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
// utils
import axios from '../../utils/axios';
import mockData from '../../utils/mock-data';

const now = new Date();

const columnIds = {
  column1: '8cd887ec-b3bc-11eb-8529-0242ac130003',
  column2: '23008a1f-ad94-4771-b85c-3566755afab7',
  column3: '37a9a747-f732-4587-a866-88d51c037641',
  column4: '4ac3cd37-b3e1-466a-8e3b-d7d88f6f5d4f'
};

const cardIds = {
  card1: 'deb02f04-9cf8-4f1e-97e0-2fbda84cc6b3',
  card2: '98bf6e8b-becc-485b-9c3f-a7d09392c48d',
  card3: '99fbc02c-de89-4be3-9515-f8bd12227d38',
  card4: 'ab9cebca-6cb4-4847-aa17-3b261b3dd0fb',
  card5: 'ebf0d26a-78e5-414f-986f-003d8fcd3154',
  card6: '9d98ce30-3c51-4de3-8537-7a4b663ee3af',
  card7: '0f71fb1f-9fce-419c-a525-46aeeb9b3e83',
  card8: '534fac32-cae1-4d77-965a-062d2114bc29',
  card9: 'dc0fa705-1740-46a4-a3ec-5c6d67b6f402',
  card10: '5b323625-c53b-4d06-86df-b59e180657a0'
};

const memberIds = {
  member1: '473d2720-341c-49bf-94ed-556999cf6ef7',
  member2: 'b8395203-887c-46f5-a85f-339b2d75c98b',
  member3: '048f6343-7a65-4873-a570-eb6ff4eb1ba3',
  member4: '18e23ac9-c874-43e4-8163-2d37f15f3367',
  member5: 'a3be5485-03bf-47a6-b553-a9cf9f070ed8'
};

const COMMENTS = [...Array(8)].map((_, index) => ({
  id: uuidv4(),
  avatar: mockData.image.avatar(index),
  name: mockData.name.fullName(index),
  createdAt: mockData.time(index),
  messageType: index === 3 || index === 5 ? 'image' : 'text',
  message:
    (index === 3 && mockData.image.feed(6)) || (index === 5 && mockData.image.feed(8)) || mockData.text.sentence(index)
}));

const cardList = [
  {
    id: cardIds.card1,
    name: 'Call with sales of HubSpot',
    description:
      'Duis condimentum lacus finibus felis pellentesque, ac auctor nibh fermentum. Duis sed dui ante. Phasellus id eros tincidunt, dictum lorem vitae, pellentesque sem. Aenean eu enim sit amet mauris rhoncus mollis. Sed enim turpis, porta a felis et, luctus faucibus nisi. Phasellus et metus fermentum, ultrices arcu aliquam, facilisis justo. Cras nunc nunc, elementum sed euismod ut, maximus eget nibh. Phasellus condimentum lorem neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sagittis pharetra eleifend. Suspendisse potenti.',
    assignee: [{ id: memberIds.member1, avatar: 'mockData.image.avatar(1)', name: mockData.name.fullName(1) }],
    due: [addDays(now, 6).getTime(), addDays(now, 7).getTime()],
    attachments: [],
    comments: COMMENTS,
    completed: true
  },
  {
    id: cardIds.card2,
    name: 'Interview for the Asis. Sales Manager',
    description: 'We are looking for vue experience and of course node js strong knowledge',
    assignee: [
      { id: memberIds.member1, avatar: 'mockData.image.avatar(1)', name: mockData.name.fullName(2) },
      { id: memberIds.member2, avatar: 'mockData.image.avatar(2)', name: mockData.name.fullName(3) },
      { id: memberIds.member4, avatar: 'mockData.image.avatar(3)', name: mockData.name.fullName(4) },
      { id: memberIds.member5, avatar: 'mockData.image.avatar(4)', name: mockData.name.fullName(5) },
      { id: memberIds.member3, avatar: 'mockData.image.avatar(5)', name: mockData.name.fullName(6) }
    ],
    due: [addDays(now, 6).getTime(), addDays(now, 7).getTime()],
    attachments: [mockData.image.feed(1)],
    comments: [],
    completed: false
  },
  {
    id: cardIds.card3,
    name: 'Change the height of the top bar because it looks too chunky',
    description: 'We nede to make it aggressive with pricing because it’s in their interest to acquire us',
    assignee: [],
    due: [null, null],
    attachments: [],
    comments: [],
    completed: true
  },
  {
    id: cardIds.card4,
    name: 'Integrate Stripe API',
    description: 'We nede to make it aggresive with pricing because it’s in their interest to acquire us',
    assignee: [
      { id: memberIds.member2, avatar: 'mockData.image.avatar(2)', name: mockData.name.fullName(7) },
      { id: memberIds.member5, avatar: 'mockData.image.avatar(5)', name: mockData.name.fullName(8) }
    ],
    due: [null, null],
    attachments: [mockData.image.feed(3)],
    comments: [],
    completed: false
  },
  {
    id: cardIds.card5,
    name: 'Update the customer API for payments',
    description: 'We need to make it aggresive with pricing because it’s in their interest to acquire us',
    assignee: [{ id: memberIds.member1, avatar: 'mockData.image.avatar(1)', name: mockData.name.fullName(9) }],
    due: [null, null],
    attachments: [],
    comments: [],
    completed: true
  },
  {
    id: cardIds.card6,
    name: 'Release minimals DS',
    description: 'Production',
    assignee: [{ id: memberIds.member1, avatar: 'mockData.image.avatar(1)', name: mockData.name.fullName(10) }],
    due: [null, null],
    attachments: [],
    comments: [],
    completed: true
  }
];

const columnList = [
  {
    id: columnIds.column1,
    name: 'Backlog',
    cardIds: [cardIds.card1, cardIds.card2, cardIds.card3]
  },
  {
    id: columnIds.column2,
    name: 'Progress',
    cardIds: [cardIds.card4, cardIds.card5]
  },
  {
    id: columnIds.column3,
    name: 'Q&A',
    cardIds: []
  },
  {
    id: columnIds.column4,
    name: 'Production',
    cardIds: [cardIds.card6]
  }
];

const board = {
  cards: cardList,
  columns: columnList,
  columnOrder: [columnIds.column1, columnIds.column2, columnIds.column3, columnIds.column4]
};
// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: false,
  board: {
    cards: {},
    columns: {},
    columnOrder: []
  }
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = objFromArray(board.cards);
      const columns = objFromArray(board.columns);
      const { columnOrder } = board;
      state.board = {
        cards,
        columns,
        columnOrder
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn
      };
      state.board.columnOrder.push(newColumn.id);
    },

    persistCard(state, action) {
      const { columns } = action.payload;
      state.board.columns = columns;
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter((id) => id !== cardId);
      state.board.cards = omit(state.board.cards, [cardId]);
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;
      const deletedColumn = state.board.columns[columnId];

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
      state.board.cards = omit(state.board.cards, [...deletedColumn.cardIds]);
      state.board.columnOrder = state.board.columnOrder.filter((c) => c !== columnId);
    }
  }
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

export function getBoard() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get('/api/kanban/board');
      // dispatch(slice.actions.getBoardSuccess(response.data.board));
      dispatch(slice.actions.getBoardSuccess(board));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createColumn(newColumn) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/new', newColumn);
      dispatch(slice.actions.createColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateColumn(columnId, updateColumn) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/update', {
        columnId,
        updateColumn
      });
      dispatch(slice.actions.updateColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteColumn(columnId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/kanban/columns/delete', { columnId });
      dispatch(slice.actions.deleteColumnSuccess({ columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder) {
  return (dispatch) => {
    dispatch(slice.actions.persistColumn(newColumnOrder));
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns) {
  return (dispatch) => {
    dispatch(slice.actions.persistCard(columns));
  };
}

// ----------------------------------------------------------------------

export function addTask(task) {
  return (dispatch) => {
    dispatch(slice.actions.addTask(task));
  };
}

// ----------------------------------------------------------------------

export function deleteTask(taskId) {
  return (dispatch) => {
    dispatch(slice.actions.deleteTask(taskId));
  };
}
