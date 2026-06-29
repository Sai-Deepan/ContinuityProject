import { useState } from "react";
import { mockComponents } from "../data/mock";
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
  DialogTrigger,
  DialogFooter
} from "../components/ui/dialog";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function Admin() {
  const [components] = useState(mockComponents);
  const totalStock = components.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Manage your electronics catalog.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="w-4 h-4" /> Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Component</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g., ESP32-WROOM-32D" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="e.g., Microcontrollers" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input type="number" placeholder="4.50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Stock</label>
                  <Input type="number" placeholder="100" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Component</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Components</CardTitle>
            <PackageIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{components.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Stock</CardTitle>
            <LayersIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Low Stock Alerts</CardTitle>
            <AlertIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {components.filter(c => c.stock < 100).length}
            </div>
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
                placeholder="Search components..."
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((component) => (
                  <TableRow key={component.id}>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
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