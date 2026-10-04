// Boot: the 2D UI comes up first, then the 3D scene plugs into it.
import { byId } from './config.js?v=19';
import { showSceneError } from './ui.js?v=19';
import { enterOffice } from './lobby.js?v=19';
import { initScene } from './scene.js?v=19';
import './visitors.js?v=19';
import './camp-music.js?v=19';

// Deep links (#publications, #office, …) skip the lobby and land inside.
const initial = location.hash.slice(1);
if (initial === 'office') enterOffice(null, { instant: true });

try {
    await initScene();
} catch (err) {
    showSceneError(err);
}

if (byId[initial]) enterOffice(initial, { instant: true });
