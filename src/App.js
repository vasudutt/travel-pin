import "./app.css";
import { useEffect, useState } from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import {Star} from "@material-ui/icons";
import axios from 'axios';
import {format} from 'timeago.js';
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try{
        const res = await axios.get('https://pin-travel-backend.herokuapp.com/api/pins');
        setPins(res.data);
      } catch (err){
        console.log(err);
      }
    }

    getPins();
  },[]);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);

    setViewState({
      ...viewState,
      latitude: lat,
      longitude: long
    });
  }

  const handleAddClick = (e) => {
    if(currentUsername){
      const lat = e.lngLat.lat;
      const long = e.lngLat.lng;
      
      setNewPlace({
        lat,
        long,
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try{
      const res = await axios.post('https://pin-travel-backend.herokuapp.com/api/pins', newPin);
      setPins([
        ...pins,
        res.data
      ]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem('user');
    setCurrentUsername(null);
  };

  return (
    <div className="App">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100vw', height: '100vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddClick}
      >

      {pins.map((p) => (
          <>
            <Marker
              key={p._id}
              latitude={p.lat}
              longitude={p.long}
              color={(currentUsername === p.username) ? "tomato" : "slateblue"}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              style={{
                cursor: "pointer",
              }}
            />
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace &&
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Tell us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
          </Popup>
        }

        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>Log Out</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={()=> {setShowLogin(true)}}>Log In</button>
            <button className="button register" onClick={() => {setShowRegister(true)}}>Register</button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername={setCurrentUsername}/>}
      </Map>
    </div>
  );
}

export default App;
