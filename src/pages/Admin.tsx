import { useState, useEffect, useMemo } from "react";
import type { Component } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "../components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

export default function Admin() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Component>>({
    id: "",
    name: "",
    category: "",
    manufacturer: "",
    price: 0,
    stock: 0,
    image: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchComponents = async () => {
    try {
      const res = await fetch('/api/components');
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setComponents(data);
    } catch (err) {
      console.error("Error fetching components:", err);
      toast.error("Failed to load inventory", {
        action: { label: 'Retry', onClick: () => fetchComponents() }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin Dashboard | Amaze Services";
    fetchComponents();
  }, []);

  // Derived state
  const totalStock = components.reduce((acc, curr) => acc + curr.stock, 0);
  
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return components;
    const lowerQ = searchQuery.toLowerCase();
    return components.filter(c => 
      c.name.toLowerCase().includes(lowerQ) ||
      c.id.toLowerCase().includes(lowerQ) ||
      c.category.toLowerCase().includes(lowerQ) ||
      c.manufacturer.toLowerCase().includes(lowerQ)
    );
  }, [components, searchQuery]);

  // Handlers
  const openAddForm = () => {
    setEditingId(null);
    setFormData({ id: "", name: "", category: "", manufacturer: "", price: 0, stock: 0, image: "", description: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (component: Component) => {
    setEditingId(component.id);
    setFormData(component);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    if (!formData.id?.trim() && !editingId) {
      toast.error("SKU/ID is required"); return false;
    }
    if (!formData.name?.trim()) {
      toast.error("Name is required"); return false;
    }
    if (!formData.category?.trim()) {
      toast.error("Category is required"); return false;
    }
    if (!formData.manufacturer?.trim()) {
      toast.error("Manufacturer is required"); return false;
    }
    if (formData.price === undefined || formData.price <= 0) {
      toast.error("Price must be greater than zero"); return false;
    }
    if (formData.stock === undefined || formData.stock < 0) {
      toast.error("Stock cannot be negative"); return false;
    }
    return true;
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/components/${editingId}` : `/api/components`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Operation failed");
      }

      toast.success(editingId ? "Component updated!" : "Component created!");
      setIsFormOpen(false);
      fetchComponents();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsSubmitting(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/components/${itemToDelete}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Component deleted");
      setComponents(prev => prev.filter(c => c.id !== itemToDelete));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsSubmitting(false);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Manage your electronics catalog.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openAddForm}>
          <Plus className="w-4 h-4" /> Add Component
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Components</CardTitle>
            <PackageIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{components.length}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Stock</CardTitle>
            <LayersIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Low Stock Alerts</CardTitle>
            <AlertIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold text-rose-600">
                {components.filter(c => c.stock < 100).length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, ID, or category..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="w-[120px]">SKU / ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-12 rounded-full ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredComponents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <PackageIcon className="w-12 h-12 mb-4 text-slate-300" />
                        <p className="text-lg font-medium text-slate-900">No components found</p>
                        <p className="text-sm">Try adjusting your search query.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        {component.image ? (
                          <img 
                            src={component.image} 
                            alt={`Image of ${component.name}`} 
                            loading="lazy"
                            className="w-10 h-10 rounded-md object-cover bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-slate-500">{component.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">{component.name}</TableCell>
                      <TableCell>{component.category}</TableCell>
                      <TableCell className="text-right font-medium">₹{component.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${component.stock < 100 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {component.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(component)}>
                            <Edit2 className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-rose-600" onClick={() => openDeleteDialog(component.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={submitForm}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Component" : "Add New Component"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU / ID</label>
                  <Input 
                    name="id" 
                    value={formData.id || ""} 
                    onChange={handleFormChange} 
                    placeholder="e.g., COMP-001" 
                    disabled={!!editingId} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    name="name" 
                    value={formData.name || ""} 
                    onChange={handleFormChange} 
                    placeholder="e.g., ESP32-WROOM-32D" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input 
                    name="category" 
                    value={formData.category || ""} 
                    onChange={handleFormChange} 
                    placeholder="e.g., Microcontrollers" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Manufacturer</label>
                  <Input 
                    name="manufacturer" 
                    value={formData.manufacturer || ""} 
                    onChange={handleFormChange} 
                    placeholder="e.g., Espressif" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input 
                    name="price" 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    value={formData.price || ""} 
                    onChange={handleFormChange} 
                    placeholder="4.50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input 
                    name="stock" 
                    type="number" 
                    min="0"
                    value={formData.stock || ""} 
                    onChange={handleFormChange} 
                    placeholder="100" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <div className="flex gap-2">
                  <Input 
                    name="image" 
                    value={formData.image || ""} 
                    onChange={handleFormChange} 
                    placeholder="https://..." 
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-10 h-10 rounded object-cover bg-slate-100 shrink-0" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  name="description" 
                  value={formData.description || ""} 
                  onChange={handleFormChange} 
                  placeholder="Short description..." 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Component"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the component
              from the inventory database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Simple internal icons for the dashboard stats
function PackageIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  )
}

function LayersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  )
}

function AlertIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  )
}