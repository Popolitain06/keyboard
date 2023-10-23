import { hash } from "bcrypt";
import bcrypt from "bcrypt";
import Query from "../model/Query.js";
import jsonwebtoken from "jsonwebtoken";


const { sign } = jsonwebtoken;
const { SK }   = process.env;
const SALT = 10;

const check_token = async (req, res) => {
    try {
        const queryUser = "SELECT email FROM users WHERE email = ?";
        await Query.findByValue(queryUser, req.params.email);
        res.status(200).json({msg: "authentifié", id: queryUser.email })
    } catch (error) {
        throw Error(error);
    }
};

const createAccount = async (req, res) => {
    try {
        let msg = "";
        const datas = {email: req.body.email };
        const queryUser =
            "SELECT email FROM users WHERE email = ?";
        const [user] = await Query.findByDatas(queryUser, datas);

        if (user.length) {
            msg = "un utilisateur avec cette identifiant ou email existe déjà";
            res.status(409).json({ msg });

        } else if (!user.length) {
            const datas = {
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                DateOfBirth: req.body.birthDate,
                Email: req.body.email,
                Password: await hash(req.body.password, SALT),
                Street: req.body.streetName,
                Number: req.body.streetNumber,
                Complement: req.body.addressComplement,
                PostalCode: req.body.postalCode,
                City: req.body.city,
            };

            const query =
            "INSERT INTO users (FirstName, LastName, DateOfBirth, Email, Password, Street, Number, Complement, PostalCode, City, Role, RegistrationDate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', NOW())";
        await Query.write(query, datas);

        msg = "utilisateur créé";
        res.status(201).json({ msg });
    }
} catch (error) {
    throw Error(error);
}
}

const signIn = async (req, res) => {
    try {
        let msg = "";
        const datas = { email: req.body.email };
        const queryUser = "SELECT * FROM users WHERE email = ?";
        const [user] = await Query.findByDatas(queryUser, datas);

        if (user.length) {
            const passwordMatch = await bcrypt.compare(req.body.password, user[0].Password);
            if (passwordMatch) {
                // Mot de passe correct, génération du token
                const TOKEN = sign({ email: user[0].Email }, SK);
                res.status(200).json({ msg: "Utilisateur trouvé", TOKEN });
            } else {
                // Mot de passe incorrect
                msg = "Mauvais identifiants";
                res.status(409).json({ msg });
            }
        } else {
            // Utilisateur non trouvé
            msg = "Identifiants incorrects";
            res.status(409).json({ msg });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la tentative de connexion." });
    }
};

const getDetails = async (req,res) =>{

    const query = "SELECT * from users WHERE email = ?"
    const [datas] = await Query.findByDatas(query,req.params);

    if(!datas.length){
        res.status(404).json({msg:"Utilisateur non reconnu"})
    }

    if(datas.length){
        res.status(200).json(datas);
        return;
    }

}



export { createAccount, signIn, check_token, getDetails };