import { Injectable } from '@angular/core';

@Injectable()
export class VotesService {
  private votes;
  private canVote: boolean = true;
  private url: string = 'https://witcher-fan-app.herokuapp.com/votes/';
  private votesInitialized: boolean = false;

  constructor() { }

  private createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, false);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }

  private makeVotesRequest() {
    const url = this.url;
    const root = this;

    const xhr = this.createCORSRequest('GET', url);
    if (!xhr) {
      console.log('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      root.votes = JSON.parse(xhr.response);
      root.votesInitialized = true;
    };

    xhr.onerror = function() {
      console.log('onerror');
    };

    xhr.send();
  }

  private makeAddRequest(nam: string) {
    const url = this.url;
    const root = this;
    let req: string = '';
    let found = false;

    function sqlString(name: string) {
      for (const v of root.votes) {
        if (name === v.name) {
          const voteAmount = v.votes + 1;
          req = 'UPDATE votes SET votes = "' + voteAmount + '" WHERE name = "' + name + '"';
          found = true;
          break;
        }

        if (!found) {
          req = 'INSERT INTO votes (name, votes) VALUES ("' + name + '", "1")';
        }
      }
    }

    const xhr = this.createCORSRequest('POST', url);
    xhr.setRequestHeader("Content-type", "text/plain");
    if (!xhr) {
      console.log('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
    };

    xhr.onerror = function() {
      console.log('onerror');
    };

    this.makeVotesRequest();
    sqlString(nam);
    xhr.send(req);
    this.makeVotesRequest();
  }

  updateVotes() {
    this.makeVotesRequest();
  }

  getVotes() {
    if (this.votesInitialized) {
      return this.votes;
    } else {
      console.log('table not initialized');
    }
  }

  addVote(name: string) {
    this.makeAddRequest(name);
  }

  hasVoted() {
    this.canVote = false;
  }

  voteStatus(): boolean {
    return this.canVote;
  }

}
