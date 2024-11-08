'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, UserPlus, Pencil, ArrowLeft } from 'lucide-react'
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

// Mock data for members
const initialMembers = [
  { id: 1, name: "John Kimani", role: "Admin" },
  { id: 2, name: "John Kimani", role: "Member" },
  { id: 3, name: "John Kimani", role: "Leader worship" },
  { id: 4, name: "John Kimani", role: "Member" },
  { id: 5, name: "John Kimani", role: "Leader traffic" },
  { id: 6, name: "John Kimani", role: "Member" },
  { id: 7, name: "John Kimani", role: "Admin" },
  { id: 8, name: "John Kimani", role: "Member" },
  { id: 9, name: "John Kimani", role: "Leader worship" },
  { id: 10, name: "John Kimani", role: "Member" },
  { id: 11, name: "John Kimani", role: "Leader traffic" },
  { id: 12, name: "John Kimani", role: "Member" },
]

const roles = ["Admin", "Member", "Leader worship", "Leader traffic"]

export default function MemberManagement() {
  const [members, setMembers] = useState(initialMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState(null)

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleChange = (memberId, newRole) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
  }
  const handleEditMember = (member) => {
    setEditingMember(member)
    setShowAddMemberForm(true)
  }


  const handleDeleteMember = (member) => {
    setMemberToDelete(member)
  }

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete.id))
      setMemberToDelete(null)
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
          initialData = {editingMember}
            onBack={() => {
              setShowAddMemberForm(false)
              setEditingMember(null)
            }} 
            
            onDelete={editingMember ? () => {
              handleDeleteMember(editingMember);
              setShowAddMemberForm(false);
          } : null}
          />
        </div>
    )
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage member access</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Members</h2>
          <p className="text-gray-600">{members.length} members</p>
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
            <UserPlus className="mr-2 h-4 w-4" /> Add member
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEditMember(member)}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member
              from the database.
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