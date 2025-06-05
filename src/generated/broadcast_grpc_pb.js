// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var broadcast_pb = require('./broadcast_pb.js');
var server_pb = require('./server_pb.js');

function serialize_lugo_GameEvent(arg) {
  if (!(arg instanceof broadcast_pb.GameEvent)) {
    throw new Error('Expected argument of type lugo.GameEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_GameEvent(buffer_arg) {
  return broadcast_pb.GameEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_GameSetup(arg) {
  if (!(arg instanceof broadcast_pb.GameSetup)) {
    throw new Error('Expected argument of type lugo.GameSetup');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_GameSetup(buffer_arg) {
  return broadcast_pb.GameSetup.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_StartRequest(arg) {
  if (!(arg instanceof broadcast_pb.StartRequest)) {
    throw new Error('Expected argument of type lugo.StartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_StartRequest(buffer_arg) {
  return broadcast_pb.StartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_WatcherRequest(arg) {
  if (!(arg instanceof broadcast_pb.WatcherRequest)) {
    throw new Error('Expected argument of type lugo.WatcherRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_WatcherRequest(buffer_arg) {
  return broadcast_pb.WatcherRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// Service to be consumed by clients (e.g. frontend, app, etc) to watch the match.
// The game server implements a Broadcast service. This service may help you to control or watch the game during
// training sessions.
var BroadcastService = exports.BroadcastService = {
  // Keep an open stream that publish all important events in the match.
onEvent: {
    path: '/lugo.Broadcast/OnEvent',
    requestStream: false,
    responseStream: true,
    requestType: broadcast_pb.WatcherRequest,
    responseType: broadcast_pb.GameEvent,
    requestSerialize: serialize_lugo_WatcherRequest,
    requestDeserialize: deserialize_lugo_WatcherRequest,
    responseSerialize: serialize_lugo_GameEvent,
    responseDeserialize: deserialize_lugo_GameEvent,
  },
  // Returns the game setup configuration.
getGameSetup: {
    path: '/lugo.Broadcast/GetGameSetup',
    requestStream: false,
    responseStream: false,
    requestType: broadcast_pb.WatcherRequest,
    responseType: broadcast_pb.GameSetup,
    requestSerialize: serialize_lugo_WatcherRequest,
    requestDeserialize: deserialize_lugo_WatcherRequest,
    responseSerialize: serialize_lugo_GameSetup,
    responseDeserialize: deserialize_lugo_GameSetup,
  },
  // StartGame allows the master watcher to start the match.
// See the Game Server starting mode to understand how it works.
startGame: {
    path: '/lugo.Broadcast/StartGame',
    requestStream: false,
    responseStream: false,
    requestType: broadcast_pb.StartRequest,
    responseType: broadcast_pb.GameSetup,
    requestSerialize: serialize_lugo_StartRequest,
    requestDeserialize: deserialize_lugo_StartRequest,
    responseSerialize: serialize_lugo_GameSetup,
    responseDeserialize: deserialize_lugo_GameSetup,
  },
};

exports.BroadcastClient = grpc.makeGenericClientConstructor(BroadcastService, 'Broadcast');
