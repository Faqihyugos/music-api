class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const credentialId = request.auth.credentials.id;
    const { playlistId, userId } = request.payload;
    await this._playlistsService.verifyPlaylistOwner(
      playlistId,
      credentialId,
    );

    const id = await this._collaborationsService.addCollaboration({ playlistId, userId });
    return h
      .response({
        status: 'success',
        message: 'Collaboration added',
        data: { collaborationId: id },
      })
      .code(201);
  }

  async deleteCollaborationHandler(request, h) {
    await this._validator.validateDeleteCollaborationPayload(request.payload);
    const credentialId = request.auth.credentials.id;
    const { playlistId, userId } = request.payload;
    await this._playlistsService.verifyPlaylistOwner(
      playlistId,
      credentialId,
    );

    await this._collaborationsService.deleteCollaboration({ playlistId, userId });
    return h.response({
      status: 'success',
      message: 'Collaboration deleted',
    });
  }
}
module.exports = CollaborationsHandler;
