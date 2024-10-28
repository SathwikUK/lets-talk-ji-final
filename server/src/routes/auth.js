import { Router } from 'express';
import { client } from '../stream-client';

const router = Router();

// POST endpoint to create a new user
router.post('/createUser', async (req, res) => {
    const { username, name, image } = req.body;
    
    // Check for required fields
    if (!username || !name || !image) {
        return res.status(400).json({ message: 'Required fields were empty' });
    }

    // Create new user object
    const newUser = {
        id: username,
        role: 'user',
        name,
        image,
    };

    try {
        // Upsert user in the client
        await client.upsertUsers({
            users: {
                [newUser.id]: newUser,
            },
        });

        // Generate token with expiry of 24 hours
        const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        const token = client.createToken(username, expiry);

        // Respond with token and user details
        res.status(200).json({
            token,
            username,
            name,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

export default router;
