// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var server_pb = require('./server_pb.js');
var physics_pb = require('./physics_pb.js');

function serialize_lugo_GameSnapshot(arg) {
  if (!(arg instanceof server_pb.GameSnapshot)) {
    throw new Error('Expected argument of type lugo.GameSnapshot');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_GameSnapshot(buffer_arg) {
  return server_pb.GameSnapshot.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_JoinRequest(arg) {
  if (!(arg instanceof server_pb.JoinRequest)) {
    throw new Error('Expected argument of type lugo.JoinRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_JoinRequest(buffer_arg) {
  return server_pb.JoinRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_OrderResponse(arg) {
  if (!(arg instanceof server_pb.OrderResponse)) {
    throw new Error('Expected argument of type lugo.OrderResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_OrderResponse(buffer_arg) {
  return server_pb.OrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lugo_OrderSet(arg) {
  if (!(arg instanceof server_pb.OrderSet)) {
    throw new Error('Expected argument of type lugo.OrderSet');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lugo_OrderSet(buffer_arg) {
  return server_pb.OrderSet.deserializeBinary(new Uint8Array(buffer_arg));
}


// Service provided by the game service to the players (clients).
var GameService = exports.GameService = {
  // JoinATeam allows the player to listen the server during the match.
joinATeam: {
    path: '/lugo.Game/JoinATeam',
    requestStream: false,
    responseStream: true,
    requestType: server_pb.JoinRequest,
    responseType: server_pb.GameSnapshot,
    requestSerialize: serialize_lugo_JoinRequest,
    requestDeserialize: deserialize_lugo_JoinRequest,
    responseSerialize: serialize_lugo_GameSnapshot,
    responseDeserialize: deserialize_lugo_GameSnapshot,
  },
  // SendOrders allows the player to send others to the server when the game is on listening state.
sendOrders: {
    path: '/lugo.Game/SendOrders',
    requestStream: false,
    responseStream: false,
    requestType: server_pb.OrderSet,
    responseType: server_pb.OrderResponse,
    requestSerialize: serialize_lugo_OrderSet,
    requestDeserialize: deserialize_lugo_OrderSet,
    responseSerialize: serialize_lugo_OrderResponse,
    responseDeserialize: deserialize_lugo_OrderResponse,
  },
};

exports.GameClient = grpc.makeGenericClientConstructor(GameService, 'Game');
