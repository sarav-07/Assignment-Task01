import axios from "axios";
import React, { useEffect, useState } from "react";

const Crud = () => {
  const [userData, setUserData] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    city: "",
    email: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      console.log(response.data);
      const data = response.data;
      setUserData(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          name: newUser.name,
          address: { city: newUser.city },
          email: newUser.email,
        }
      );
      setUserData([...userData, response.data]);
      setNewUser({
        name: "",
        city: "",
        email: "",
      });
    } catch (err) {
      console.log("Error adding User", err);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setDeleteUser(user);
    setIsDeleteModalOpen(true);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${editUser.id}`,
        {
          name: editUser.name,
          address: { city: editUser.address.city },
          email: editUser.email,
        }
      );
      setUserData(userData.map((user) =>
        user.id === editUser.id ? { ...response.data } : user
      ));
      setIsEditModalOpen(false); 
    } catch (err) {
      console.log("Error editing user", err);
    }
  };

 

  const handleDelete = async () => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${deleteUser.id}`);
      setUserData(userData.filter((user) => user.id !== deleteUser.id));
      setIsDeleteModalOpen(false); // Close modal
    } catch (err) {
      console.log("Error deleting user", err);
    }
  };

  return (
    <div className="flex items-center flex-col justify-between gap-10 w-full ">
      <h1 className="text-4xl font-semibold">Crud</h1>

      <div className="flex flex-row gap-16 justify-between">
        <table className=" border-collapse border border-gray-300 w-1/2">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300">Id</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">City</th>
              <th className="px-4 py-2 border border-gray-300">Email</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr className="hover:bg-gray-100" key={user.id}>
                <td className="px-4 py-2 border border-gray-300">{user.id}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {user.name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {user.address.city}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {user.email}
                </td>

                <td className="flex gap-4 items-center px-4 justify-center my-4">
                  <button
                    className=" cursor-pointer px-6 py-2 border border-gray-300 bg-blue-500 text-white rounded-lg"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className=" cursor-pointer px-6 py-2 border border-gray-300 bg-red-500 text-white rounded-lg"
                    onClick={(data) => handleDeleteUser(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold mb-4">Add a User</h2>
          <form
            action=""
            className="flex flex-col items-center justify-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="">Name</label>
              <input
                name="name"
                value={newUser.name}
                onChange={handleChange}
                type="text"
                className="outline-none border-gray-200 border"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="">City</label>
              <input
                name="city"
                value={newUser.city}
                onChange={handleChange}
                type="text"
                className="outline-none border-gray-200 border"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="">Email</label>
              <input
                name="email"
                value={newUser.email}
                onChange={handleChange}
                type="email"
                className="outline-none border-gray-200 border"
              />
            </div>
            <button className="px-8 py-2 bg-black text-white mt-3 rounded-md">
              Submit
            </button>
          </form>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="flex flex-col gap-2 mb-4">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="border p-2"
                />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={editUser.address.city}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      address: { ...editUser.address, city: e.target.value },
                    })
                  }
                  className="border p-2"
                />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="border p-2"
                />
              </div>
              <button className="px-8 py-2 bg-blue-500 text-white rounded-md">
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-8 py-2 bg-gray-500 text-white rounded-md ml-4"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

{isDeleteModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-2xl mb-4">Delete User</h2>
        <p>Are you sure you want to delete {deleteUser.name}?</p>
        <button
          onClick={handleDelete}
          className="px-8 py-2 bg-red-500 text-white rounded-md"
        >
          Delete
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-8 py-2 bg-gray-500 text-white rounded-md ml-4"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
      
    </div>
  );
};

export default Crud;
