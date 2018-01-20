import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      searchTerm: ''
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} onTermChange={this.updateSearchTerm}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }

  addTrack(track) {
    let tempPlaylist = this.state.playlistTracks;
    let found = false;
    for(let i=0; i<tempPlaylist.length; i++) {
      if (tempPlaylist[i].id === track.id) {
        found = true;
        break;
      }
    }

    if (found === false) {
      tempPlaylist.push(track);
    }

    this.setState( {playlistTracks: tempPlaylist} );
  }

  removeTrack(track) {
    let tempPlaylist = this.state.playlistTracks.filter(t => t !== track);
    this.setState( {playlistTracks: tempPlaylist} );
  }

  updatePlaylistName(name) {
    this.setState( {playlistName: name} );
  }

  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.map(t => trackURIs.push(t));
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks)
      .then( () => {
        this.setState( { playlistName: 'New Playlist', playlistTracks: [] } );
      });
  }

  search() {
    if (this.state.searchTerm.length > 0) {
      Spotify.search(this.state.searchTerm).then(results => {
        this.setState({searchResults: results})
      });
    } else {
      this.setState({searchResults: []});
    }
  }

  updateSearchTerm(term) {
    this.setState({searchTerm: term});
  }
}

export default App;
