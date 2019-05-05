import React, { Component } from "react";
import "./App.css";
import Peer from "simple-peer";

class App extends Component {
  constructor() {
    super();
    this.state = {
      myId: "",
      yourId: "",
      peers: [],
      messages: ""
    };

    this.startPeer = this.startPeer.bind(this);
    this.changeOthers = this.changeOthers.bind(this);
    this.connectPeers = this.connectPeers.bind(this);
    this.send = this.send.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="buttons">
            <button onClick={() => this.startPeer(true)}>Create Server</button>
            <button onClick={() => this.startPeer(false)}>Create Client</button>
          </div>
          <div className="peers">
            <div className="peer">
              <label>My id:</label>
              <textarea readOnly value={this.state.myId} />
            </div>
            <div className="peer">
              <label>Peer id:</label>
              <textarea
                value={this.state.yourId}
                onChange={this.changeOthers}
              />
            </div>
          </div>
          <div className="connectContainer">
            <button className="connect" onClick={this.connectPeers}>
              Connect
            </button>
          </div>
          <button onClick={this.send}>Send</button>
          <hr />
          <textarea readOnly value={this.state.messages} />
        </div>
      </div>
    );
  }

  startPeer(initiator) {
    const peer = new Peer({ initiator: initiator, trickle: false });
    console.log(this.state.peers);
    console.log(peer);
    console.log("peer id", peer._id);
    this.setState(prevState => {
      const peers = prevState.peers;
      console.log(
        "peers.find(p => p._id === peer._id)",
        peers.find(p => p._id === peer._id)
      );
      if (peers.find(p => p._id === peer._id) === undefined) peers.push(peer);
      return { peers: peers };
    });
    peer.on("signal", data => {
      console.log("signal recieved", data);
      this.setState(prevState => {
        const peers = prevState.peers;
        if (peers.find(p => p._id === peer._id) === undefined) peers.push(peer);
        return { myId: btoa(JSON.stringify(data)), peers: peers };
      });
    });

    peer.on("data", data => {
      console.log(data);
      this.setState(prevState => ({ messages: prevState.messages + data }));
    });
  }

  changeOthers(e) {
    this.setState({ yourId: e.target.value });
  }

  connectPeers() {
    console.log(this.state.peers);
    this.state.peers[this.state.peers.length - 1].signal(
      JSON.parse(atob(this.state.yourId))
    );
  }

  send() {
    this.state.peers.map(peer => peer.send("a"));
  }
}

export default App;
