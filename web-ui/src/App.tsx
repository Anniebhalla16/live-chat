import { Provider } from 'react-redux';
import './App.css';
import ChatBox from './components/Chatbox';
import { store } from './redux/store';

function App() {
  return (
    <>
      <Provider store={store}>
        <ChatBox />
      </Provider>
    </>
  );
}

export default App;
