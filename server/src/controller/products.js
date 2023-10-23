import Query from "../model/Query.js";



const getAll = async (req, res) => {

    // Query pour récupérer les données de la table products, models et categories
    const query = "SELECT * FROM products JOIN models ON models.ProductID = products.ProductID JOIN categories ON categories.CategoryID = products.CategoryID";
    const [datas] = await Query.find(query);

    res.status(200).json({ datas });
}

const getNew = async (req, res) => {

    // Query pour récupérer les dernieres données de la table products, models et categories
    const query = "SELECT * FROM products JOIN models ON models.ProductID = products.ProductID JOIN categories ON categories.CategoryID = products.CategoryID LIMIT 3";
    const [datas] = await Query.find(query);

    res.status(200).json({ datas });
}

const getCategories = async (req, res) => {

    // Query pour récupérer les dernieres données de la table products, models et categories
    const query = "SELECT * FROM categories";
    const [datas] = await Query.find(query);

    res.status(200).json({ datas });
}

const getDetails = async (req, res) => {

    // Query pour récupérer les données de la table products, models et categories en fonction de l'id
    const query = "SELECT * FROM products JOIN models ON models.ProductID = products.ProductID JOIN categories ON categories.CategoryID = products.CategoryID WHERE products.ProductID = ?";
    const [datas] = await Query.findByValue(query, req.params.id);

    res.status(200).json({ datas });
}

const getCategoriesDetails = async (req, res) => {

    // Query pour récupérer les données de la table products, models et categories en fonction de l'id
    const query = "SELECT * FROM products JOIN models ON models.ProductID = products.ProductID JOIN categories ON categories.CategoryID = products.CategoryID WHERE categories.CategoryID = ?";
    const [datas] = await Query.findByValue(query, req.params.id);

    res.status(200).json({ datas });
}



export { getAll, getNew, getDetails, getCategories, getCategoriesDetails };