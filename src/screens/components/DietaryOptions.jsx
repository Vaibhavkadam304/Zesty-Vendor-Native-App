import { List, Switch, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
export default function DietaryOptions({ store, onToggle }) {
  const { colors } = useTheme();

  return (
    <List.Section title="Dietary Options">
      {[
        ['diet_option1', 'Gluten Free', 'bread-slice'],
        ['diet_option2', 'Sugar Free', 'cup'],
        ['diet_option3', 'Eggless', 'egg'],
        ['diet_option4', 'Nut Free', 'peanut'],
        ['diet_option5', 'Vegan', 'leaf'],
      ].map(([key, label, icon]) => (
        <List.Item
          key={key}
          title={label}
        //   left={() => <List.Icon icon={icon} />}
          right={() => (
            <Switch
              value={store[key] === 'yes'}
              onValueChange={v => onToggle(key, v ? 'yes' : 'no')}
              color={colors.primary}
            />
          )}
        />
      ))}
    </List.Section>
  );
}

