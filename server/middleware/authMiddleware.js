import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import Employee from '../model/Employee.js';

export const verifyUser = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                error: "Invalid authorization header format. Expected 'Bearer <token>'" 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: "Token not provided" 
            });
        }

        // Verify token using JWT
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        // Check token expiration
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            // Token is expired but valid - refresh it
            const newToken = jwt.sign(
                { ...decoded },
                process.env.JWT_KEY,
                { 
                    expiresIn: '24h',
                    algorithm: 'HS256'
                }
            );
            
            // Set new token in response header
            res.setHeader('x-refreshed-token', newToken);
        }

        // Determine which model to use based on user type
        let user;
        if (decoded.type === 'employee') {
            user = await Employee.findById(decoded._id)
                .populate('department')
                .populate('position');
                
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    error: "Employee not found" 
                });
            }
            
            // Attach the user to the request object based on type
            req.employee = user;
            // For employees, always exclude password
            user = user.toObject();
            delete user.password;
        } else {
            user = await User.findById(decoded._id);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    error: "User not found" 
                });
            }
        }

        // Add user data to request
        req.user = user;
        req.employee = decoded.type === 'employee' ? user : null;
        next();

    } catch (jwtError) {
        // Token verification failed
        if (jwtError.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                error: "Token has expired. Please refresh your session." 
            });
        }
        return res.status(401).json({ 
            success: false, 
            error: "Invalid token" 
        });
    }
};