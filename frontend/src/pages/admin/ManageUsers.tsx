import React, { useEffect, useState } from 'react';
import { userService } from '../../api/user.service';
import { User } from '../../types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      // Optimistic update
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, active: !currentStatus } : user
      ));

      try {
        if (currentStatus) {
          await userService.deactivateUser(id);
        } else {
          await userService.activateUser(id);
        }
        toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`);
      } catch (err) {
        toast.error("Action failed");
        // Revert on error
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, active: currentStatus } : user
        ));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">#{user.id}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {user.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.active !== false)}
                      className={`p-2 rounded-lg transition-colors ${user.active !== false
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-green-500 hover:bg-green-50'
                        }`}
                      title={user.active !== false ? 'Deactivate' : 'Activate'}
                    >
                      {user.active !== false ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
