import { List, Switch, useTheme } from 'react-native-paper';

export default function ShippingOptions({ store, onToggle }) {
  const { colors } = useTheme();

  return (
    <List.Section title="Shipping Options">
      {[
        ['local_pickup',     'Local Pickup',    'truck'],
        ['shipping_offered', 'Shipping Offered','truck-delivery'],
      ].map(([key, label, icon]) => {
        const current = store.shipping_options || [];
        return (
          <List.Item
            key={key}
            title={label}
            // left={() => <List.Icon icon={icon} />}
            right={() => (
              <Switch
                value={current.includes(key)}
                onValueChange={v =>
                  onToggle(
                    'shipping_options',
                    v
                      ? [...current, key]
                      : current.filter(o => o !== key)
                  )
                }
                color={colors.primary}
              />
            )}
          />
        );
      })}
    </List.Section>
  );
}
