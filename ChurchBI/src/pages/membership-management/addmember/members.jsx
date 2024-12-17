// MemberManagement.js

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, UserPlus, Pencil, ArrowLeft, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AddMemberForm from '../addmember/AddMember'

const roles = ["Admin", "Member", "Leader worship", "Leader traffic"]

export default function MemberManagement() {
  // Existing state variables
  const [members, setMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [updatedMembers, setUpdatedMembers] = useState(new Set());
  const [hoveredRow, setHoveredRow] = useState(null);
  const [totalMembers, setTotalMembers] = useState(0);


  // Fetch members function
  const fetchMembers = async (search = '') => {
    try {
      const response = await axios.get('https://statistics-production-032c.up.railway.app/api/members', {
        params: { search: search.trim() || undefined },
      });
  
      const { members: fetchedMembers } = response.data;
  
      // Process members to split the name
      const processedMembers = fetchedMembers.map(member => {
        const nameParts = member.name.split(' ');
        return {
          id: member.member_id,
          firstName: nameParts[0] || '',
          middleName: nameParts[1] || '',
          lastName: nameParts.slice(2).join(' ') || '',
          ...member,
        };
      });
  
      // Set all members at once
      setMembers(processedMembers);
      setTotalMembers(processedMembers.length); 
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };
  

  // Initial fetch and when searchTerm changes
  useEffect(() => {
    fetchMembers(searchTerm); // Fetch members whenever searchTerm changes
  }, [searchTerm]);
  

  const handleRoleChange = (memberId, newRole) => {
    setMembers(prevMembers => prevMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))

    // Track updated members
    setUpdatedMembers(prev => {
      const updatedSet = new Set(prev)
      updatedSet.add(memberId)
      return updatedSet
    })

    setHasUnsavedChanges(true)
  }

  const handleEditMember = async (memberId) => {
    console.log('Member ID:', memberId);
    if (!memberId) {
      console.error('Member ID is undefined or null.');
      return;
    }
  
    try {
      const response = await axios.get(`https://statistics-production-032c.up.railway.app/api/members/${memberId}`);
      const member = response.data;
  
      const nameParts = member.name ? member.name.split(' ') : [];
      const firstName = nameParts[0] || '';
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
      const lastName = nameParts[nameParts.length - 1] || '';
  
      const mappedData = {
        firstName,
        middleName,
        lastName,
        dob: member.date_of_birth || "",
        contactInfo: member.contact_info || "",
        gender: member.gender || "",
        location: member.location || "",
        countyOfOrigin: member.county_of_origin || "",
        occupationStatus: member.occupation_status || "",
        marriedStatus: member.married_status || "",
        isVisiting: member.is_visiting || false,
        isFullMember: member.is_full_member || false,
        baptized: member.baptized || false,
        discipleshipClassId: member.discipleship_class_id || null,
        completedClass: member.completed_class || false,
        conversionDate: member.conversion_date || '',
        nextOfKinFirstName: member.nextOfKinFirstName || '',
        nextOfKinLastName: member.nextOfKinLastName || '',
        nextOfKinContactInfo: member.nextOfKinContactInfo || '',
        
        // Volunteering fields
        fellowshipMinistryName: member.fellowshipMinistryName || '',
        fellowshipRole: member.fellowshipRole || '',
        serviceMinistryName: member.serviceMinistryName || '',
        serviceRole: member.serviceRole || '',
      };
  
      setEditingMember(mappedData);
      setShowAddMemberForm(true);
    } catch (error) {
      console.error('Error fetching member details:', error);
      alert('Failed to fetch member details. Please try again.');
    }
  };
  

  const handleCancelChange = (memberId) => {
    // Revert the member's role to its original state by refetching
    const revertChanges = async () => {
      // Re-fetch the member data from the backend
      try {
        const response = await axios.get(`https://statistics-production-032c.up.railway.app/api/members/${memberId}`)
        const member = response.data

        const nameParts = member.name.split(' ')
        const firstName = nameParts[0] || ''
        const middleName = nameParts[1] || ''
        const lastName = nameParts.slice(2).join(' ') || ''

        // Update the member in the local state
        setMembers(prevMembers => prevMembers.map(m => 
          m.id === memberId ? {
            ...m,
            firstName,
            middleName,
            lastName,
            role: member.role,
          } : m
        ))

        // Remove from updatedMembers
        setUpdatedMembers(prev => {
          const updatedSet = new Set(prev)
          updatedSet.delete(memberId)
          return updatedSet
        })

        setHasUnsavedChanges(updatedMembers.size > 1)
      } catch (error) {
        console.error('Error reverting changes:', error)
      }
    }
    revertChanges()
  }

  const handleDeleteMember = (member) => {
    setMemberToDelete(member)
  }

  const confirmDeleteMember = async () => {
    if (memberToDelete) {
      try {
        await axios.delete(`https://statistics-production-032c.up.railway.app/api/members/${memberToDelete.id}`)
        setMembers(prevMembers => prevMembers.filter(m => m.id !== memberToDelete.id))
        setTotalMembers(prevTotal => prevTotal - 1)
        setMemberToDelete(null)
      } catch (error) {
        console.error("Error deleting member:", error.response?.data || error.message)
        alert("Failed to delete member. Please try again.")
      }
    }
  }

  if (showAddMemberForm) {
    return (
      <div className="p-4">
        <Button onClick={() => {
          setShowAddMemberForm(false)
          setEditingMember(null)
        }} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
        </Button>
       
        <AddMemberForm 
          initialData={editingMember}
          onBack={() => {
            setShowAddMemberForm(false)
            setEditingMember(null)
          }} 
          onDelete={editingMember ? () => {
            handleDeleteMember(editingMember)
            setShowAddMemberForm(false)
          } : null}
          onSuccess={() => {
            fetchMembers(searchTerm)
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Member Access</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header and Search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Members</h2>
          <p className="text-gray-600">{totalMembers} members</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddMemberForm(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>

        {/* Members Table with Infinite Scroll */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  className={updatedMembers.has(member.id) ? "bg-yellow-100" : ""}
                  onMouseEnter={() => setHoveredRow(member.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>{`${member.firstName} ${member.middleName} ${member.lastName}`}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-40 justify-between">
                          {member.role} <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {roles.map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => handleRoleChange(member.id, role)}
                          >
                            {role}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {updatedMembers.has(member.id) && hoveredRow === member.id && (
                      <Button
                        variant="ghost"
                        onClick={() => handleCancelChange(member.id)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </TableCell>

                  <TableCell>
                    <Button variant="ghost" onClick={() => handleEditMember(member.id)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>

      {/* Unsaved Changes Submit Button */}
      {hasUnsavedChanges && updatedMembers.size > 0 && (
        <div className="fixed bottom-4 right-12">
          <Button 
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600"
            onClick={async () => {
              try {
                // Prepare updates
                const updates = Array.from(updatedMembers).map(memberId => {
                  const member = members.find(m => m.id === memberId)
                  return { id: member.id, role: member.role }
                })
                // Send updates to backend
                await axios.put('https://statistics-production-032c.up.railway.app/api/members/update', { updates })
                setHasUnsavedChanges(false) // Reset unsaved changes after submission
                setUpdatedMembers(new Set()) // Clear updated members
                  fetchMembers(searchTerm)
              } catch (error) {
                console.error('Error submitting changes:', error)
                alert('Failed to submit changes. Please try again.')
              }
            }}
          >
            Submit
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMember}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

MemberManagement.propTypes = {
  // Define prop types if necessary
}
