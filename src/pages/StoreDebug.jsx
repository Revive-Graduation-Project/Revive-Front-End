import { useEffect } from 'react';
import useRestaurantStore from '../store/restaurantStore';
import useOrderStore from '../store/orderStore';
import useFavoritesStore from '../store/favoritesStore';
import useLoyaltyStore from '../store/loyaltyStore';
import { useAuthStore } from '../store';

/**
 * StoreDebug Page
 * ─────────────────────────────────────────
 * Route: /debug
 * Purpose: Visually verify all stores are
 * fetching mock data and actions work correctly.
 * DELETE this page before production.
 */
export default function StoreDebug() {
  // ── Stores ──────────────────────────────
  const { meals, fetchMeals, loading: mealsLoading, error: mealsError } = useRestaurantStore();
  const { items, totalItems, totalAmount, addItem, removeItem, clearCart, getDeliveryFee, getTotalWithDelivery } = useOrderStore();
  const { favorites, toggleFavorite, isFavorite, clearFavorites } = useFavoritesStore();
  const { points, history, earnPoints, redeemPoints, resetLoyalty } = useLoyaltyStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (meals.length === 0) fetchMeals();
  }, []);

  const sectionStyle = {
    background: '#1a1a2e', border: '1px solid #333', borderRadius: 12,
    padding: 20, marginBottom: 20,
  };
  const titleStyle = { color: '#e94560', fontSize: 18, fontWeight: 700, marginBottom: 12 };
  const badgeStyle = (ok) => ({
    display: 'inline-block', padding: '2px 10px', borderRadius: 20,
    background: ok ? '#1a472a' : '#4a1a1a', color: ok ? '#4ade80' : '#f87171',
    fontSize: 12, fontWeight: 600, marginLeft: 8,
  });
  const btnStyle = (color = '#e94560') => ({
    background: color, color: '#fff', border: 'none', borderRadius: 8,
    padding: '6px 14px', cursor: 'pointer', fontSize: 13, marginRight: 6, marginTop: 6,
  });
  const preStyle = {
    background: '#0f0f1a', borderRadius: 8, padding: 12,
    fontSize: 12, color: '#a0aec0', overflowX: 'auto', maxHeight: 160, overflowY: 'auto',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', padding: 24, fontFamily: 'monospace', color: '#e2e8f0' }}>
      <h1 style={{ color: '#e94560', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        🧪 Store Debug Page
      </h1>
      <p style={{ color: '#718096', marginBottom: 28, fontSize: 13 }}>
        Delete this page before production. Visit <code style={{ color: '#e94560' }}>/debug</code> to test stores.
      </p>

      {/* ── AUTH STORE ── */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          🔐 Auth Store
          <span style={badgeStyle(isAuthenticated)}>{isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTH'}</span>
        </div>
        <pre style={preStyle}>{JSON.stringify({ isAuthenticated, user }, null, 2)}</pre>
      </div>

      {/* ── RESTAURANT / MEALS STORE ── */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          🍽️ Restaurant Store (Meals)
          <span style={badgeStyle(meals.length > 0)}>{mealsLoading ? 'Loading...' : `${meals.length} meals`}</span>
        </div>
        {mealsError && <p style={{ color: '#f87171', marginBottom: 8 }}>❌ Error: {mealsError}</p>}
        <button style={btnStyle()} onClick={fetchMeals}>↺ Re-fetch Meals</button>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {meals.map(meal => (
            <div key={meal.id} style={{
              background: '#12122a', border: '1px solid #2d2d4e', borderRadius: 10,
              padding: '10px 14px', minWidth: 140,
            }}>
              <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{meal.name}</div>
              <div style={{ color: '#a0aec0', fontSize: 12 }}>{meal.category} · {meal.price} EGP</div>
              <button style={{ ...btnStyle('#2563eb'), marginTop: 6 }} onClick={() => addItem(meal)}>+ Add to Cart</button>
              <button
                style={{ ...btnStyle(isFavorite(meal.id) ? '#7c3aed' : '#374151'), marginTop: 6 }}
                onClick={() => toggleFavorite(meal)}
              >
                {isFavorite(meal.id) ? '❤️ Fav' : '🤍 Fav'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── ORDER / CART STORE ── */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          🛒 Order Store (Cart)
          <span style={badgeStyle(totalItems > 0)}>{totalItems} items · {totalAmount} EGP</span>
        </div>
        <div style={{ marginBottom: 10, color: '#a0aec0', fontSize: 13 }}>
          Delivery Fee: <strong style={{ color: '#e2e8f0' }}>{getDeliveryFee()} EGP</strong>
          &nbsp;|&nbsp; Total with Delivery: <strong style={{ color: '#4ade80' }}>{getTotalWithDelivery()} EGP</strong>
        </div>
        <button style={btnStyle('#ef4444')} onClick={clearCart}>Clear Cart</button>
        {items.length === 0
          ? <p style={{ color: '#4a5568', marginTop: 10 }}>Cart is empty — add meals above</p>
          : (
            <table style={{ marginTop: 10, width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#718096', textAlign: 'left' }}>
                  <th style={{ padding: '4px 8px' }}>Item</th>
                  <th style={{ padding: '4px 8px' }}>Price</th>
                  <th style={{ padding: '4px 8px' }}>Qty</th>
                  <th style={{ padding: '4px 8px' }}>Subtotal</th>
                  <th style={{ padding: '4px 8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderTop: '1px solid #1e1e3a' }}>
                    <td style={{ padding: '6px 8px' }}>{item.name}</td>
                    <td style={{ padding: '6px 8px', color: '#a0aec0' }}>{item.price}</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>{item.quantity}</td>
                    <td style={{ padding: '6px 8px', color: '#4ade80' }}>{item.price * item.quantity}</td>
                    <td style={{ padding: '6px 8px' }}>
                      <button style={btnStyle('#ef4444')} onClick={() => removeItem(item.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {/* ── FAVORITES STORE ── */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          ❤️ Favorites Store
          <span style={badgeStyle(favorites.length > 0)}>{favorites.length} favorites</span>
        </div>
        <button style={btnStyle('#ef4444')} onClick={clearFavorites}>Clear All</button>
        {favorites.length === 0
          ? <p style={{ color: '#4a5568', marginTop: 10 }}>No favorites yet — toggle ❤️ on a meal above</p>
          : <pre style={{ ...preStyle, marginTop: 10 }}>{JSON.stringify(favorites.map(f => ({ id: f.id, name: f.name })), null, 2)}</pre>
        }
      </div>

      {/* ── LOYALTY STORE ── */}
      <div style={sectionStyle}>
        <div style={titleStyle}>
          🏆 Loyalty Store
          <span style={badgeStyle(points > 0)}>{points} pts</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button style={btnStyle('#16a34a')} onClick={() => earnPoints(50)}>+ Earn 50 pts</button>
          <button style={btnStyle('#d97706')} onClick={() => redeemPoints(20)}>- Redeem 20 pts</button>
          <button style={btnStyle('#ef4444')} onClick={resetLoyalty}>Reset</button>
        </div>
        <div style={{ color: '#a0aec0', fontSize: 13, marginBottom: 8 }}>History ({history.length} entries):</div>
        <pre style={preStyle}>{history.length > 0 ? JSON.stringify(history.slice(-5), null, 2) : 'No history yet'}</pre>
      </div>
    </div>
  );
}
