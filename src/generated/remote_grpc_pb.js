// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var remote_pb = require('./remote_pb.js');
var physics_pb = require('./physics_pb.js');
var server_pb = require('./server_pb.js');

function serialize_lugo_BallProperties(arg) {
  if (!(arg instanceof remote_pb.BallProperties)) {
    throw new Error('Expected argument of type lugo.BallProperties');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_BallProperties(buffer_arg) {
  return remote_pb.BallProperties.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_CommandResponse(arg) {
  if (!(arg instanceof remote_pb.CommandResponse)) {
    throw new Error('Expected argument of type lugo.CommandResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_CommandResponse(buffer_arg) {
  return remote_pb.CommandResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_GameProperties(arg) {
  if (!(arg instanceof remote_pb.GameProperties)) {
    throw new Error('Expected argument of type lugo.GameProperties');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_GameProperties(buffer_arg) {
  return remote_pb.GameProperties.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_GameSnapshotRequest(arg) {
  if (!(arg instanceof remote_pb.GameSnapshotRequest)) {
    throw new Error('Expected argument of type lugo.GameSnapshotRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_GameSnapshotRequest(buffer_arg) {
  return remote_pb.GameSnapshotRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_GameSnapshotResponse(arg) {
  if (!(arg instanceof remote_pb.GameSnapshotResponse)) {
    throw new Error('Expected argument of type lugo.GameSnapshotResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_GameSnapshotResponse(buffer_arg) {
  return remote_pb.GameSnapshotResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_NextOrderRequest(arg) {
  if (!(arg instanceof remote_pb.NextOrderRequest)) {
    throw new Error('Expected argument of type lugo.NextOrderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_NextOrderRequest(buffer_arg) {
  return remote_pb.NextOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_NextTurnRequest(arg) {
  if (!(arg instanceof remote_pb.NextTurnRequest)) {
    throw new Error('Expected argument of type lugo.NextTurnRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_NextTurnRequest(buffer_arg) {
  return remote_pb.NextTurnRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_PauseResumeRequest(arg) {
  if (!(arg instanceof remote_pb.PauseResumeRequest)) {
    throw new Error('Expected argument of type lugo.PauseResumeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_PauseResumeRequest(buffer_arg) {
  return remote_pb.PauseResumeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_PlayerProperties(arg) {
  if (!(arg instanceof remote_pb.PlayerProperties)) {
    throw new Error('Expected argument of type lugo.PlayerProperties');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_PlayerProperties(buffer_arg) {
  return remote_pb.PlayerProperties.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_ResetPlayerPositionsRequest(arg) {
  if (!(arg instanceof remote_pb.ResetPlayerPositionsRequest)) {
    throw new Error('Expected argument of type lugo.ResetPlayerPositionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_ResetPlayerPositionsRequest(buffer_arg) {
  return remote_pb.ResetPlayerPositionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_ResetPlayerPositionsResponse(arg) {
  if (!(arg instanceof remote_pb.ResetPlayerPositionsResponse)) {
    throw new Error('Expected argument of type lugo.ResetPlayerPositionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_ResetPlayerPositionsResponse(buffer_arg) {
  return remote_pb.ResetPlayerPositionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_ResumeListeningRequest(arg) {
  if (!(arg instanceof remote_pb.ResumeListeningRequest)) {
    throw new Error('Expected argument of type lugo.ResumeListeningRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_ResumeListeningRequest(buffer_arg) {
  return remote_pb.ResumeListeningRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_ResumeListeningResponse(arg) {
  if (!(arg instanceof remote_pb.ResumeListeningResponse)) {
    throw new Error('Expected argument of type lugo.ResumeListeningResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_ResumeListeningResponse(buffer_arg) {
  return remote_pb.ResumeListeningResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// The game server implements a Remote service that allows you to control the game flow.
// This service may help you to control or watch the game during training sessions.
// The game server only offers this service on debug mode on.
var RemoteService = exports.RemoteService = {
  pauseOrResume: {
    path: '/lugo.Remote/PauseOrResume',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.PauseResumeRequest,
    responseType: remote_pb.CommandResponse,
    requestSerialize: serialize_lugo_PauseResumeRequest,
    requestDeserialize: deserialize_lugo_PauseResumeRequest,
    responseSerialize: serialize_lugo_CommandResponse,
    responseDeserialize: deserialize_lugo_CommandResponse,
  },
  nextTurn: {
    path: '/lugo.Remote/NextTurn',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.NextTurnRequest,
    responseType: remote_pb.CommandResponse,
    requestSerialize: serialize_lugo_NextTurnRequest,
    requestDeserialize: deserialize_lugo_NextTurnRequest,
    responseSerialize: serialize_lugo_CommandResponse,
    responseDeserialize: deserialize_lugo_CommandResponse,
  },
  nextOrder: {
    path: '/lugo.Remote/NextOrder',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.NextOrderRequest,
    responseType: remote_pb.CommandResponse,
    requestSerialize: serialize_lugo_NextOrderRequest,
    requestDeserialize: deserialize_lugo_NextOrderRequest,
    responseSerialize: serialize_lugo_CommandResponse,
    responseDeserialize: deserialize_lugo_CommandResponse,
  },
  setBallProperties: {
    path: '/lugo.Remote/SetBallProperties',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.BallProperties,
    responseType: remote_pb.CommandResponse,
    requestSerialize: serialize_lugo_BallProperties,
    requestDeserialize: deserialize_lugo_BallProperties,
    responseSerialize: serialize_lugo_CommandResponse,
    responseDeserialize: deserialize_lugo_CommandResponse,
  },
  setPlayerProperties: {
    path: '/lugo.Remote/SetPlayerProperties',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.PlayerProperties,
    responseType: remote_pb.CommandResponse,
    requestSerialize: serialize_lugo_PlayerProperties,
    requestDeserialize: deserialize_lugo_PlayerProperties,
    responseSerialize: serialize_lugo_CommandResponse,
    responseDeserialize: deserialize_lugo_CommandResponse,
  },
  setGameProperties: {
    path: '/lugo.Remote/SetGameProperties',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.GameProperties,
    responseType: remote_pb.CommandResponse,
    requestSerialize: serialize_lugo_GameProperties,
    requestDeserialize: deserialize_lugo_GameProperties,
    responseSerialize: serialize_lugo_CommandResponse,
    responseDeserialize: deserialize_lugo_CommandResponse,
  },
  resumeListeningPhase: {
    path: '/lugo.Remote/ResumeListeningPhase',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.ResumeListeningRequest,
    responseType: remote_pb.ResumeListeningResponse,
    requestSerialize: serialize_lugo_ResumeListeningRequest,
    requestDeserialize: deserialize_lugo_ResumeListeningRequest,
    responseSerialize: serialize_lugo_ResumeListeningResponse,
    responseDeserialize: deserialize_lugo_ResumeListeningResponse,
  },
  resetPlayerPositions: {
    path: '/lugo.Remote/ResetPlayerPositions',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.ResetPlayerPositionsRequest,
    responseType: remote_pb.ResetPlayerPositionsResponse,
    requestSerialize: serialize_lugo_ResetPlayerPositionsRequest,
    requestDeserialize: deserialize_lugo_ResetPlayerPositionsRequest,
    responseSerialize: serialize_lugo_ResetPlayerPositionsResponse,
    responseDeserialize: deserialize_lugo_ResetPlayerPositionsResponse,
  },
  getGameSnapshot: {
    path: '/lugo.Remote/GetGameSnapshot',
    requestStream: false,
    responseStream: false,
    requestType: remote_pb.GameSnapshotRequest,
    responseType: remote_pb.GameSnapshotResponse,
    requestSerialize: serialize_lugo_GameSnapshotRequest,
    requestDeserialize: deserialize_lugo_GameSnapshotRequest,
    responseSerialize: serialize_lugo_GameSnapshotResponse,
    responseDeserialize: deserialize_lugo_GameSnapshotResponse,
  },
};

exports.RemoteClient = grpc.makeGenericClientConstructor(RemoteService, 'Remote');
