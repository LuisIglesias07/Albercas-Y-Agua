import re

# Read the file
with open(r'd:\Albercas y Agua\Albercas_Agua\src\components\Admin\AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove uploadProductImage import
content = content.replace(
    "import { uploadProductImage, createProduct, updateProduct, deleteProduct, toggleProductAvailability } from '../../services/adminService';",
    "import { createProduct, updateProduct, deleteProduct, toggleProductAvailability } from '../../services/adminService';"
)

# 2. Replace imageFile state with imageUrl
content = content.replace(
    "const [imageFile, setImageFile] = useState<File | null>(null);",
    "const [imageUrl, setImageUrl] = useState('');"
)

# 3. Replace handleImageChange function
old_func = """    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };"""

new_func = """    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url);
    };"""

content = content.replace(old_func, new_func)

# 4. Update openCreateModal to reset imageUrl
content = content.replace(
    "setImageFile(null);",
    "setImageUrl('');"
)

# 5. Update image upload logic in handleSubmit
old_submit = """        try {
            let imageUrl = editingProduct?.image || '';

            if (imageFile) {
                const productId = editingProduct?.id || `product_${Date.now()}`;
                imageUrl = await uploadProductImage(imageFile, productId);
            }

            const productData: Partial<Product> = {"""

new_submit = """        try {
            const productData: Partial<Product> = {"""

content = content.replace(old_submit, new_submit)

# 6. Update productData image field
content = content.replace(
    "image: imageUrl",
    "image: imageUrl || editingProduct?.image || ''"
)

# 7. Replace file input with URL input
old_input = """                                <div className="form-group">
                                    <label>Imagen del Producto</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />"""

new_input = """                                <div className="form-group">
                                    <label>URL de Imagen del Producto</label>
                                    <input
                                        type="url"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        value={imageUrl}
                                        onChange={handleImageUrlChange}
                                    />
                                    <small style={{color: '#6B7280', fontSize: '0.85rem', marginTop: '4px', display: 'block'}}>
                                        Sube tu imagen a Imgur, Google Drive (link público), o cualquier servicio gratuito
                                    </small>"""

content = content.replace(old_input, new_input)

# Write back
with open(r'd:\Albercas y Agua\Albercas_Agua\src\components\Admin\AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("AdminDashboard.tsx updated successfully!")
print("- Removed file upload functionality")
print("- Added URL input field for images")
print("- Updated all related functions")
