import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './actions/userActions';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
 
const App = () => {
  const dispatch = useDispatch();
  const { users, loading, error, hasMore, skip, limit } = useSelector(state => state);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('id');
  const [filters, setFilters] = useState({ gender: ''});
  const [sortedUsers, setSortedUsers] = useState(users);
 
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchUsers(limit, skip));
    }
  }, [loading, hasMore, skip, limit, dispatch]);
 
  useEffect(() => {
    loadMore();
  }, [loadMore]);
 
  useEffect(() => {
    // Sort users whenever `users` array, `sortColumn`, or `sortOrder` changes
    const sortUsers = () => {
      const newSortedUsers = [...users].sort((a, b) => {
        if (sortColumn === 'id') {
          return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        } else if (sortColumn === 'name') {
          return sortOrder === 'asc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
        } else if (sortColumn === 'age') {
          return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
        }
        return 0;
      });
      setSortedUsers(newSortedUsers);
    };
    sortUsers();
  }, [users, sortColumn, sortOrder]);
 
  const handleSort = (column) => {
    setSortColumn(column);
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };
 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
 
  const filteredUsers = sortedUsers.filter(user => {
    return (!filters.gender || user.gender === filters.gender);
  });
 
  const observer = React.useRef();
  const lastUserElementRef = React.useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);
 
  const getGenderLabel = (gender) => {
    if (gender === 'male') return 'M';
    if (gender === 'female') return 'F';
    return 'Unknown';
  };
 
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Employees</h1>
      <div className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">Gender:</label>
            <select className="form-select" name="gender" value={filters.gender} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="col-md-4">
          </div>
        </div>
      </div>
      <table className="table table-striped rounded">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
              ID {sortColumn === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Image</th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Full Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Demography</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id} ref={index === filteredUsers.length - 1 ? lastUserElementRef : null}>
              <td>{user.id}</td>
              <td>
                <img src={user.image} alt="User" className="img-fluid rounded-circle" style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{user.firstName} {user.maidenName} {user.lastName}</td>
              <td>{getGenderLabel(user.gender)}/{user.age}</td>
              <td>{user.company.title}</td>
              <td>{user.address.state},{user.address.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">Error: {error}</div>}
    </div>
  );
};
 
export default App;
 
 