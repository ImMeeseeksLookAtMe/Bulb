//mongoose
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["publisher", "user" ],
        default: "publisher"    
    },
    name: {
        type:String
    },
    surname: {
        type: String
    },
    avatar:{
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

//pagination
module.exports = function (model, pager, limiter) {
    const page = parseInt(pager)
    const limit = parseInt(limiter) 

    const startIndex = ( page - 1 ) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < model.length) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }


    if ( startIndex > 0 ) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    results.pageCount = {
        pages: Math.ceil(model.length/limit)
    }

    results.results = model.slice(startIndex, endIndex)

    return results
          
}

//get route
router.get('/:workspace_id/service', auth, async (req, res) =>{
    try {
        const workspace = await Workspace.find({user: req.user.id})
        // Looks for params ID == Workspace ID
        if(workspace[0]._id.toString() === req.params.workspace_id.toString()) {
        
            const services = await Service.find({workspace: workspace[0]._id})

            if(services === []) {
                return res.status(400)
                .json({msg: 'There no services in workspace for this user'})
            }
            const pager = req.query.page
            const limiter = req.query.limit
            const paginatedServices = pagination(services, pager, limiter)
            res.send(paginatedServices)
        } else {
        res.status(400).send({msg: 'Not authorized.'})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.')
    }
})

// post route
router.post(
    '/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('surname', 'Last name is required').not().isEmpty(),
        check('email', 'Please add a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more charaters')
        .isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req); 
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, surname, email, password } = req.body;
        
        try {
            let user = await User.findOne({ email });
            
            //see if user exists
            if(user) {
                return res.status(400).json({errors: [{ msg: 'User already exists' }] })
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
              });
         
            user = new User({
                name,
                email,
                surname,
                password,
                avatar
            });
            
            //encrpyt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
        
            const payload = {
                user: {
                    id: user.id
                }
            }
            
            //return jsonwebtoken
            jwt.sign(payload, config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token })
                }
            );
            
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }
    }
)