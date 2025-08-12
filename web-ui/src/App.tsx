import { Provider } from 'react-redux';
import './App.css';
import { Counter } from './components/counter';
import { store } from './redux-store/store';

function App() {
  return (
    <>
      <Provider store={store}>
        <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200">
          {/* <Chatbox /> */}
          <Counter />
        </div>
      </Provider>
    </>
  );
}

export default App;
