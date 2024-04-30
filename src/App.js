import "./App.css";
import { useState, useEffect } from "react";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";

const appToaster = Toaster.create({
  position: "top",
});

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setnewName] = useState("");
  const [newEmail, setnewEmail] = useState("");
  const [newWebsite, setnewWebsite] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")  //get link from api
      .then((response) => response.json())    // Formating to jsontype
      .then((json) => setUsers(json));    //set values to setusers
  }, []);

  function addUser() {
    const name = newName.trim();  //trim => used to trim extra space
    const email = newEmail.trim();
    const website = newWebsite.trim();
    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {  // to sent POST link
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8", 
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          appToaster.show({
            message: "User added successfully",
            intent: "success",
            timeout: 3000,
          });
          setnewName("");    // After added users then empty the input values
          setnewEmail("");
          setnewWebsite("");
        });
    }
  }

  function ChangeEvent(id,key,value){
    setUsers((users)=>{
      return users.map(user => {
        return user.id ===id? {...user,[key]:value} :user;
      })
    })
  }
  function updateUser(id){
    const user =users.find((user)=>user.id===id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        appToaster.show({
          message: "User added successfully",
          intent: "success",
          timeout: 3000,
        });
      });
  }
  function delUser(id){
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((users)=>{
         return users.filter(user=>user.id!==id)
        })
        appToaster.show({
          message: "User deleted successfully",
          intent: "success",
          timeout: 3000,
        });
      });
  }

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText  onChange={value => ChangeEvent(user.id, 'email' ,value)} value={user.email} />
              </td>
              <td>
                <EditableText  onChange={value => ChangeEvent(user.id, 'website' ,value)} value={user.website} />
              </td>
              <td>
                <Button intent="primary" onClick={()=> updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent="danger" onClick={()=> delUser(user.id)} >Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setnewName(e.target.value)}
                placeholder="Enter name"
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setnewEmail(e.target.value)}
                placeholder="Enter email"
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setnewWebsite(e.target.value)}
                placeholder="Enter website"
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
