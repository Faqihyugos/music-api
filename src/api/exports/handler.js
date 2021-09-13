class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
  }

  postExportsHandler = async (request, h) => {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const userId = request.auth.credentials.id;
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const message = {
      userId,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
