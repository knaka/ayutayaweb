package ayutayasvr

import (
	"reflect"
	"strings"
	"testing"
)

func TestLocaleEnumMatchesMessagesKeys(t *testing.T) {
	field, ok := reflect.TypeOf(helloInput{}).FieldByName("Locale")
	if !ok {
		t.Fatal("Locale field not found")
	}

	enumTag := field.Tag.Get("enum")
	if enumTag == "" {
		t.Fatal("enum tag not found")
	}

	// enumの値を分割
	enumValues := strings.Split(enumTag, ",")

	// 各enum値がmessagesのキーとして存在するかチェック
	for _, enumValue := range enumValues {
		enumValue = strings.TrimSpace(enumValue)
		if _, exists := messages[enumValue]; !exists {
			t.Errorf("enum value %q does not exist in messages map", enumValue)
		}
	}
}
