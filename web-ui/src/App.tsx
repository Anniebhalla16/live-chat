import { Provider } from 'react-redux';
import './App.css';
import Chatbox from './components/Chatbox';
import { store } from './redux-store/store';

function App() {
  return (
    <>
      <Provider store={store}>
        <div className="h-full w-ful">
          <Chatbox />
          {/* <Counter /> */}
        </div>
      </Provider>
    </>
  );
}

export default App;
