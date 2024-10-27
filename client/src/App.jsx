import { useState } from 'react'
import './App.css'
import { useQuery, gql } from '@apollo/client';

const query = gql`
  query getatodoswithuser{
    gettodos {
      id
      title
      completed
      user {
        id 
        name
        phone
        email
      }
    }
  }
`;

export default function App() {

  const { loading, error, data } = useQuery(query);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>User Name</th>
            <th>User Phone</th>
            <th>User Email</th>
          </tr>
        </thead>
        <tbody>
          {data.gettodos.map((todo, index) => (
            <tr key={index}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td className={todo.completed ? 'completed' : 'pending'}>
                {todo.completed ? 'Completed' : 'Pending'}
              </td>
              <td>{todo.user.name}</td>
              <td>{todo.user.phone}</td>
              <td>{todo.user.email}</td>
            </tr>  
          ))}
        </tbody>
      </table>
    </div>
  );
}
