import re

# Read the file
with open(r'd:\Albercas y Agua\Albercas_Agua\src\components\Admin\AdminDashboard.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old button styles
old_button = r'''\.create-product-btn \{[^}]*\}

\.create-product-btn:hover \{[^}]*\}'''

# Define the new button styles
new_button = '''.create-product-btn {
    background: linear-gradient(135deg, #10B981, #059669);
    color: var(--white);
    padding: 16px 32px;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
}

.create-product-btn::before {
    content: '✨';
    font-size: 1.3rem;
}

.create-product-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669, #047857);
}

.create-product-btn:active {
    transform: translateY(-1px);
}'''

# Replace
content_new = re.sub(old_button, new_button, content, flags=re.DOTALL)

# Write back
with open(r'd:\Albercas y Agua\Albercas_Agua\src\components\Admin\AdminDashboard.css', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("Button styles updated successfully!")
