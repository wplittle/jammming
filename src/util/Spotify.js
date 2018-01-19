let accessToken;
const clientId = '16dd99c6363c4871abf1f68697aae458';
const redirectUri = 'http://localhost:3000';

let Spotify = {
  getAccessToken: function() {
    if (accessToken) {
      return accessToken;
    } else {
      let token = window.location.href.match(/access_token=([^&]*)/);
      let expiry = window.location.href.match(/expires_in=([^&]*)/);
      if (token && expiry) {
        accessToken = token[1];
        window.setTimeout(() => accessToken = '', expiry[1] * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      }
    }
  },

  search: function(term) {
    try {
      Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          if (jsonResponse.tracks) {
            return jsonResponse.tracks.items.map(
              track => {
                return {
                  id: track.id,
                  name: track.name,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  uri: track.uri
                }
              }
            )
          } else {
            return [];
          }
        });
    } catch (error) {
      console.log(error);
    }
  },

  savePlaylist: function(playlistName, tracks) {
    try {
      if (playlistName && tracks) {
        Spotify.getAccessToken();
        let headers = { headers: { Authorization: `Bearer ${accessToken}` } };
        let userId;
        let playlistId;
        return fetch(`https://api.spotify.com/v1/me`, headers)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          }, networkError => console.log(networkError.message)
          )
          .then(jsonResponse => {
            userId = jsonResponse.id;
          }
          ).then( () => {
            return {
              headers: Object.assign(
                {},
                headers.headers,
                {
                  'Content-Type': 'application/json',
                }
              ),
              method: 'POST',
              body: JSON.stringify(
                {
                  name: playlistName
                }
              )
            };
          }
          ).then( content => {
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, content)
              .then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                  throw new Error('Request failed!');
                }, networkError => console.log(networkError.message)
              )
              .then(jsonResponse => {
                  playlistId = jsonResponse.id;
                }
              ).then(() => {
                let trackList = [];
                tracks.forEach( obj => {
                  trackList.push(obj.uri);
                });
                return {
                  headers: Object.assign(
                    {},
                    headers.headers,
                    {
                      'Content-Type': 'application/json',
                    }
                  ),
                  method: 'POST',
                  body: JSON.stringify(
                    {
                      uris: trackList
                    }
                  )
                };
              }
              ).then(content => {
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, content)
                  .then(response => {
                      if (response.ok) {
                        return response.json();
                      }
                      throw new Error('Request failed!');
                    }, networkError => console.log(networkError.message)
                  );
              });
          })
      }
      return '';
    } catch(error) {
      console.log(error);
    }
  }
}

export default Spotify;