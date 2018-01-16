import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { rootSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  (state, action) => state,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)
