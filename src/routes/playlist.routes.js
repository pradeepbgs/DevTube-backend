import Router from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import { 
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,

} from '../controllers/playlist.controller.js'




const router = Router()

router.use(verifyJwt)

router.route('/').post(createPlaylist)

router.route('/:playlistId')
            .get(getPlaylistById)
            .delete(deletePlaylist)
            .patch(updatePlaylist);

router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist)

router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist)

router.route('/user/:userId').get(getUserPlaylists)

export default router