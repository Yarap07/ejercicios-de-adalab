import { useEffect, useState } from 'react';
import { Route, matchPath, Routes, useLocation } from 'react-router-dom';
import '../styles/App.scss';
import adalabLogo from '../images/adalab-logo.png';
import callToApi from '../services/api';
import ls from '../services/localStorage';
import Profile from './Profile';
import Header from './Header';
import ComposeModal from './ComposeModal';
import Tweets from './Tweets';
import Home from './Home';
import Search from './Search';
import TweetDetail from './TweetDetail';
import Loader from './Loader';
import { v4 as uuidv4 } from 'uuid';
import date from '../services/date';

function App() {
  //States
  const [composeIsOpen, setComposeIsOpen] = useState(false);
  //Es una práctica muy habitual llamar al ls y que cuando esté vacío me devuelva un valor por defecto
  const [composeText, setComposeText] = useState(ls.get('composeText', ''));
  const [tweets, setTweets] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [profile, setProfile] = useState({});
  const { pathname } = useLocation();

  //Effects
  //Aqui mando llamar a todos los datos de la api al arrancar la página
  //1. Poner el array vacio indica que solo se ejecutará una vez
  //2. No poner nada hará que se lance en loop eterno
  //3. Poner un estado o algo indica que solo se lanzará cuando los datos de ese estado cambien
  useEffect(() => {
    setShowLoading(true);
    callToApi.getTweets().then((data) => {
      setShowLoading(false);
      setTweets(data);
    });
  }, []);

  useEffect(() => {
    callToApi.getProfile().then((data) => {
      setProfile(data);
    });
  }, []);

  //Este use effect le indico que solo se ejecute cuando el composetext cambie.
  //1. La primera vez se ejecuta segun arranca la pagina
  //2. Y la segunda cuando escribo en el composeText porque su estado cambia.
  useEffect(() => {
    ls.set('composeText', composeText);
  }, [composeText]);

  //Events

  const handleToggleCompose = () => {
    setComposeIsOpen(!composeIsOpen);
  };

  const handleComposeText = (value) => {
    setComposeText(value);
  };

  const handleComposeSubmit = () => {
    tweets.unshift({
      id: uuidv4(),
      avatar: profile.avatar,
      user: profile.user,
      username: profile.username,
      date: date.getCurrentDate(),
      text: composeText, //porque el texto quiero que sea el que escriba yo en el tweet
      comments: 0,
      retweets: 0,
      likes: 0,
    });
    setTweets([...tweets]); //si no hacemos el spread nos pintará la pagina de nuevo con los mismos datos
    setComposeIsOpen(false); //cierra la seccion una vez hacemos click en el boton
    setComposeText(''); //vacia el textarea una vez cerramos el tweet para que no se quede ahi por siempre
  };

  const handleSearchText = (searchtext) => {
    setSearchText(searchtext);
  };

  const getFilteredTweets = () => {
    return tweets.filter(
      (eachTweet) =>
        eachTweet.text.toLowerCase().includes(searchText.toLowerCase()) ||
        eachTweet.user.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  //Render Helpers

  // const renderTweets2 = () => {
  //   return tweets.map(tweet => {
  //     return (
  //       <Tweet2
  //         key={tweet.id}
  //         avatar={tweet.avatar}
  //         user={tweet.user}
  //         username={tweet.username}
  //         date={tweet.date}
  //         text={tweet.text}
  //         comments={tweet.comments}
  //         retweets={tweet.retweets}
  //         likes={tweet.likes}
  //       />
  //     );
  //   });
  // };

  const renderComposeModal = () => {
    if (composeIsOpen) {
      return (
        <ComposeModal
          handleSubmit={handleComposeSubmit}
          handleToggle={handleToggleCompose}
          adalabLogo={adalabLogo}
          composeText={composeText}
          handleComposeText={handleComposeText}
        />
      );
    }
  };

  const getTweet = () => {
    const RouteTweetData = matchPath('/tweet/:tweetId', pathname);
    if (RouteTweetData) {
      const tweetId =
        RouteTweetData !== null ? RouteTweetData.params.tweetId : '';
      const routeTweet = tweets.find((eachTweet) => eachTweet.id === tweetId);
      return routeTweet || {}; //Ponemos esto para que no nos de katakroker cuando nos devuelva routeTweet un undefined que rompa la funcion
    }
  };
  //Esto no funciona??

  return (
    <div className='page'>
      <Header handleClick={handleToggleCompose} />
      <main className='main'>
        {/* Poniendo el exact evitamos que al pasar por el home deje el home y busque el resto de rutas. ¿Por que deja el home? Porque al ver que la ruta empieza por "/" ya no sigue buscando y se queda en esa y ya está*/}
        <Routes>
          <Route path='/' exact element={<Home />}></Route>
          <Route
            path='/search'
            element={
              <Search
                searchText={searchText}
                setsearchText={handleSearchText}
              />
            }
          ></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route
            path='/tweet/:tweetId'
            element={<TweetDetail getTweet={getTweet()} tweets={tweets} />}
          ></Route>
        </Routes>
        <Tweets tweets={getFilteredTweets} />
        {renderComposeModal()}
      </main>
      <Loader showLoading={showLoading} />
    </div>
  );
}

export default App;
