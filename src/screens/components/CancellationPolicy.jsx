import { List, Divider, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';

export default function CancellationPolicy({ policy, onChange }) {
  const { colors } = useTheme();

  return (
    <List.Section>
      {Object.entries(policy).map(([key, val]) => (
        <List.Accordion
          key={key}
          title={key.replace(/_/g, ' ')}
          left={props => <List.Icon {...props} icon="percent-box-outline" />}
          style={{ backgroundColor: colors.surface }}
        >
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <Picker
              selectedValue={val}
              onValueChange={v => onChange('cancellation_policy', key, v)}
              style={{ color: colors.text }}
            >
              {['100%', '75%', '50%', '25%', '0%'].map(opt => (
                <Picker.Item label={opt} value={opt} key={opt} />
              ))}
            </Picker>
          </View>
          <Divider />
        </List.Accordion>
      ))}
    </List.Section>
  );
}
