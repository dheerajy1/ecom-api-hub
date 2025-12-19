import { Router } from 'express';
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router();

// about
router.get('/', async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../..', 'components', 'about.htm'))
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Server error'
        return res.status(500).json({ message: msg });
    }
})

export default router;