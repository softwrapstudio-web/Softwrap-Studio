import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../../utils/useAuth.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    image_url: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      stock: '',
      image_url: '',
      description: '',
      category: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([{
          title: formData.title,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: formData.image_url || null,
          description: formData.description || null,
          category: formData.category || null
        }])
        .select();

      if (error) throw error;

      alert('Product added successfully!');
      fetchProducts();
      resetForm();
    } catch (err) {
      alert('Error adding product: ' + err.message);
      console.error('Error adding product:', err);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: formData.title,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: formData.image_url || null,
          description: formData.description || null,
          category: formData.category || null
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      alert('Product updated successfully!');
      fetchProducts();
      resetForm();
    } catch (err) {
      alert('Error updating product: ' + err.message);
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
      console.error('Error deleting product:', err);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      price: product.price || '',
      stock: product.stock || '',
      image_url: product.image_url || '',
      description: product.description || '',
      category: product.category || ''
    });
    setShowAddForm(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>Error loading products</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#333' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: '#666' }}>
            Manage your products and inventory
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            View Store
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button 
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: showAddForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {showAddForm ? '✕ Cancel' : '+ Add New Product'}
        </button>
        <button 
          onClick={fetchProducts}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Romance Hamper"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Valentine's Love, Gifting Ideas"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="2499.00"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="50"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Product description..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button 
                type="button"
                onClick={resetForm}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#666'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              No products found
            </p>
            <p>Click "Add New Product" to create your first product</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '1rem'
          }}>
            {products.map(product => (
              <div 
                key={product.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s',
                  ':hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}>
                  {/* Product Image */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#e0e0e0'
                  }}>
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '2rem'
                      }}>
                        📦
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
                      {product.title}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      gap: '2rem',
                      color: '#666',
                      fontSize: '0.95rem'
                    }}>
                      <span><strong>Price:</strong> ₹{product.price}</span>
                      <span><strong>Stock:</strong> {product.stock} units</span>
                      {product.category && <span><strong>Category:</strong> {product.category}</span>}
                    </div>
                    {product.description && (
                      <p style={{ 
                        margin: '0.5rem 0 0 0', 
                        color: '#666',
                        fontSize: '0.9rem'
                      }}>
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => startEdit(product)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}