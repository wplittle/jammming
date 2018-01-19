import React, { Component } from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName}
               onChange={this.handleNameChange} />
        <TrackList isRemoval={true}
                   tracks={this.props.playlistTracks}
                   onRemove={this.props.onRemove} />
        <a className="Playlist-save"
           onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }


}

export default Playlist;