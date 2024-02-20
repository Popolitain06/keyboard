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

import jwt from 'jsonwebtoken'

const getDetails = async (req, res) => {
    try {
        const token = req.headers.authentication.split(' ')[1]; // Récupérer le token depuis les headers
        const decodedToken = jwt.verify(token, SK);

        const query = "SELECT * from users WHERE email = ?"
        const [datas] = await Query.findByDatas(query, [decodedToken.email]); // Utiliser l'email extrait du token

        if (!datas.length) {
            res.status(404).json({ msg: "Utilisateur non reconnu" })
        }

        res.status(200).json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateDetails = async (req, res) => {
    try {
        const token = req.headers.authentication.split(' ')[1]; // Récupérer le token depuis les headers
        const decodedToken = jwt.verify(token, SK); // Décoder le token

        const datasToUpdate = {};

        if (req.body.firstName && req.body.firstName.trim() !== '') {
            datasToUpdate.FirstName = req.body.firstName;
        }

        if (req.body.lastName && req.body.lastName.trim() !== '') {
            datasToUpdate.LastName = req.body.lastName;
        }

        if (req.body.dateOfBirth && req.body.dateOfBirth.trim() !== '') {
            datasToUpdate.DateOfBirth = req.body.dateOfBirth;
        }

        if (req.body.number && req.body.number.trim() !== '') {
            datasToUpdate.Number = req.body.number;
        }

        if (req.body.email && req.body.email.trim() !== '') {
            datasToUpdate.email = req.body.email;
        }

        if (Object.keys(datasToUpdate).length === 0) {
            return res.status(400).json({ msg: "Aucune donnée à mettre à jour" });
        }

        // Build the SQL query dynamically based on the fields to update
        let query = "UPDATE users SET ";
        let values = [];
        for (let field in datasToUpdate) {
            query += `${field} = ?, `;
            values.push(datasToUpdate[field]);
        }
        query = query.slice(0, -2); // Remove the last comma and space
        query += " WHERE email = ?";
        values.push(decodedToken.email);

        const [userDatas] = await Query.write(query, values);

        if (!userDatas) {
            return res.status(404).json({ msg: "Utilisateur non reconnu" });
        }

        const newEmail = datasToUpdate.email || decodedToken.email;
        const newToken = sign({ email: newEmail }, SK);
        // Send the new token in the 'Authentication' header
        res.setHeader('Authentication', `Bearer ${newToken}`);
        // Expose the 'Authentication' header
        res.setHeader('Access-Control-Expose-Headers', 'Authentication');
        res.status(200).json(userDatas); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export { createAccount, signIn, check_token, getDetails, updateDetails };