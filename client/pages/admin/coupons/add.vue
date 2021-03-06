<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card>
        <v-card-title>
          <span>Thêm mã giảm giá</span>
          <v-spacer />
          <v-btn
            :disabled="!valid"
            color="primary"
            @click="save"
          >
            Thêm mới
            <v-icon right>
              mdi-content-save
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="mb-2">
            <v-slide-x-transition
              v-for="error in $store.getters.errors"
              :key="error[0]"
            >
              <v-alert
                dense
                dismissible
                type="error"
              >
                {{ error[0] }}
              </v-alert>
            </v-slide-x-transition>
          </div>
          <v-text-field
            v-model="data.code"
            label="Mã giảm giá"
            placeholder="Để trống để tạo mã tự động"
            flat
            dense
            outlined
            required
            autocomplete="off"
          />
          <v-text-field
            v-model="data.value"
            label="Giá trị"
            placeholder="Chỉ nhập số, không thêm '%' hay 'đ' ở đây"
            :suffix="data.is_percent?'%':'đ'"
            flat
            dense
            outlined
            required
            autocomplete="off"
            type="number"
            :rules="[rules.required, ruleValue]"
          />
          <v-switch
            v-model="data.is_percent"
            :label="percentLabel"
          />
        </v-card-text>
        <v-card-title>Cài đặt</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="data.number"
            label="Giới hạn số lượng"
            placeholder="Để trống nếu không có giới hạn"
            flat
            dense
            outlined
            required
            autocomplete="off"
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="data.min"
                label="Đơn hàng tối thiểu"
                placeholder="Để trống nếu không có giới hạn"
                flat
                dense
                outlined
                required
                hint="Giá trị đơn hàng tối thiểu để áp dụng mã giả giá"
                autocomplete="off"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="data.max"
                label="Giảm tối đa"
                placeholder="Để trống nếu không có giới hạn"
                flat
                dense
                outlined
                required
                hint="Chỉ có tác dụng với mã giảm theo %, là số lượng tiền giảm tối đa"
                autocomplete="off"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-menu
                v-model="date.menu_start"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="date.start"
                    label="Ngày bắt đầu"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date.start"
                  @input="date.menu_start = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="date.menu_end"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="date.end"
                    label="Ngày hết hạn"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date.end"
                  @input="date.menu_end = false"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>
<script>
export default {
  layout: "admin",
  middleware: "authorized",
  meta: {
    auth: {
      permission: "coupon.create"
    }
  },
  data() {
    return {
      valid: false,
      rules: {
        required: v => !!v || 'Không được bỏ trống',
      },
      data: {
        code: null,
        value: null,
        number: null,
        min: null,
        max: null,
        is_percent: false,
        starts_at: null,
        expires_at: null,
      },
      date: {
        menu_start: false,
        menu_end: false,
        start: null,
        end: null
      },
    };
  },
  computed: {
    percentLabel() {
      let text = this.data.is_percent ? "Giảm theo phần trăm" : "Giảm cố định";
      return `Loại: ${text}`
    },
  },
  watch: {
    'date.start': {
      handler() {
        this.updateStart()
      }
    },
    'date.end': {
      handler() {
        this.updateEnd()
      }
    },
    'data.is_percent': {
      handler() {
        this.$nextTick(() => {
          this.$refs.form.validate();
        });
      }
    }
  },
  methods: {
    save() {
      this.$axios.post("/admin/coupons", this.data)
      .then(res => {
        this.$router.push({
          name: "admin-coupons-id",
          params: {
            id: res.data.coupon.id
          }
        })
      })
      .catch(() => {
        this.$notifier.showMessage({
          content: 'Có lỗi, vui lòng thử lại',
          color: 'error',
          right: false
        })
      })
    },
    updateStart() {
      this.data.starts_at = new Date(this.date.start).toISOString()
    },
    updateEnd() {
      this.data.expires_at = new Date(this.date.end).toISOString()
    },
    ruleValue(value) {
      if (this.data.is_percent) {
        return value <= 100 || "Giám theo phần trăm tối đa 100%"
      }
      return true;
    }
  }
};
</script>
