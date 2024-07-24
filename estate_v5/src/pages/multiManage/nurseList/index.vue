<template>
  <div id="nurese-list">
    <div v-if="indexLists">
      <div class="query-list">
        <Row>
          <Col :span="24">
            <Form :inline="true" :model="formInline" ref="formInline" class="form-inline" @submit.native.prevent>
              <FormItem>
                <Select v-model="formInline.packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
                  <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
                </Select>
              </FormItem>
              <FormItem>
                <TreeSelect :placeholder="$t('selectGroup')" multiple style="width: 200px" show-checkbox v-model="formInline.packetFilter" transfer :data="packetFilterList" />
              </FormItem>
              <FormItem v-if="viewTableFlag">
                <Select v-model="formInline.nursePersons" style="width: 200px" :placeholder="$t('pleaseSelectGridman')" :clearable="true">
                  <Option v-for="item in nursePersonList" :value="item.value" :key="item.value" :label="item.name"></Option>
                </Select>
              </FormItem>
              <FormItem v-if="viewHistoryFlag">
                <Select v-model="formInline.nursePersons" style="width: 200px" :placeholder="$t('pleaseSelectGridman')" :clearable="true">
                  <Option v-for="item in nursePersonList" :value="item.name" :key="item.value" :label="item.name"></Option>
                </Select>
              </FormItem>
              <FormItem>
                <Select v-model="formInline.levelTypes" style="width: 200px" :placeholder="$t('todayCareCodeAbnormalLevel')" :clearable="true" v-if="viewTableFlag">
                  <Option v-for="item in levelList" :value="item.value" :key="item.value" :label="item.label"></Option>
                </Select>
              </FormItem>
              <FormItem>
                <Input v-model="formInline.telPhone" :placeholder="$t('pleaseEnterNameOrContact')" style="width: 200px"></Input>
              </FormItem>
              <FormItem v-if="viewTableFlag">
                <Input v-model="formInline.mac" :placeholder="$t('topologyPlaceholder2')" style="width: 200px"></Input>
              </FormItem>
              <FormItem v-if="viewHistoryFlag">
                <Cascader :data="macData" v-model="formInline.macLine" style="width: 340px" filterable :clearable="isClear" :placeholder="$t('pleaseSelectDeviceLine')"></Cascader>
              </FormItem>
              <FormItem>
                <Button class="b-blue" @click="onSubmit('formInline')">{{ $t('query') }}</Button>
              </FormItem>
              <FormItem>
                <Button @click="emptyReset">{{ $t('reset') }}</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
      <div class="view-list" v-if="viewTableFlag">
        <div class="list-head">
          <div>
            <h3>{{ $t('watchLineList') }}</h3>
          </div>
          <div>
            <Button type="primary" @click="addViewLine('indexOpen')">+{{ $t('addWatchLine') }}</Button>
            <Button type="primary" class="marL" @click="openPersonManage">{{ $t('gridderManagement') }}</Button>
            <Button type="primary" class="marR" :disabled="nurseListData.filter(item => item._checked).length === 0" @click="openParamConfig">{{ $t('parameterConfiguration') }}</Button>
            <Button type="primary" @click="openHistoryTable({})">{{ $t('alarmHistory') }}</Button>
          </div>
        </div>
        <div>
          <Table :data="nurseListData" :columns="columnNurse" @on-select="getSelecChange" @on-select-cancel="getCancelChange" @on-select-all="selectAll(true)" @on-select-all-cancel="selectAll(false)">
            <template slot-scope="{ row }" slot="devices">
              <div>
                <div>{{ row.macName }}</div>
                <div>{{ '(' + row.mac + ')' }}</div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="lines">
              <div>
                <span>{{ row.addrTitle }}</span>
                <div>{{ '(' + row.showAddr + ')' }}</div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="nusrePer">
              <div>
                <div>{{ row.kpName }}</div>
                <div v-if="row.kpName">{{ row.kpTelephone.split(',')[0] ? '(' + row.kpTelephone.split(',')[0] + ')' : '(' + row.kpTelephone + ')' }}</div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="viewPer">
              <div style="color: #007eff" @click="openUserInfo(row)">
                <div class="pointer">{{ row.personName }}</div>
                <div class="pointer" v-if="row.personName">{{ '(' + row.personTelephone + ')' }}</div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="viewPerAddress">
              {{ row.personAddress }}
            </template>
            <template slot-scope="{ row }" slot="noNomalLevel">
              <span style="color: #0dd667">
                {{ row.levelCompare0[0].total }}
              </span>
              :
              <span style="color: #e0e71c">
                {{ row.levelCompare1[0].total }}
              </span>
              :
              <span style="color: #007eff">
                {{ row.levelCompare2[0].total }}
              </span>
              :
              <span style="color: #ea903a">
                {{ row.levelCompare3[0].total }}
              </span>
              :
              <span style="color: #e03c3a">
                {{ row.levelCompare4[0].total }}
              </span>
            </template>
            <template slot-scope="{ row }" slot="todayLove">
              <Poptip trigger="click" :transfer="true">
                <span>
                  <span v-if="row.todayLevel === 0"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #0dd667"></i></span>
                  <span v-if="row.todayLevel === 1"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e0e71c"></i></span>
                  <span v-if="row.todayLevel === 2"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #007eff"></i></span>
                  <span v-if="row.todayLevel === 3"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #ea903a"></i></span>
                  <span v-if="row.todayLevel === 4"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e03c3a"></i></span>
                </span>

                <!-- 演示 -->

                <div slot="content">
                  <!-- <div style="font-size:146px" class="icon-v5 icon-v5-bhjqr8b"></div> -->
                  <div style="width: 100px; height: 100px"><img :src="row.careCodeUrl" alt="" style="width: 100%; height: 100%" /></div>
                </div>
              </Poptip>
            </template>
            <template slot-scope="{ row }" slot="todaynoNomal">
              <div style="display: flex" v-if="row.errHours">
                <div class="redBoxs">{{ row.errHours.length > 1 ? row.errHours.split(',')[0] : row.errHours }}{{ $t('timeSpan') }}</div>
                <Tooltip placement="top" max-width="470" transfer>
                  <div v-if="row.errHours.split(',').length > 1" class="redBoxs">{{ '+' + (row.errHours.split(',').length - 1) }}</div>
                  <div slot="content" style="white-space: normal">
                    <div style="display: flex; flex-wrap: wrap">
                      <div v-for="(item, index) in row.errHours.split(',')" :key="index">
                        <div v-if="index > 0" class="redBoxs">{{ item }}{{ $t('timeSpan') }}</div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </div>
            </template>
            <template slot-scope="{ row }" slot="actiongs">
              <div style="display: flex">
                <Button type="text" class="blueC" @click="openSingleConfig(row)">{{ $t('parameterConfiguration') }}</Button>
                <Button type="text" class="blueC" @click="openUserInfo(row)">{{ $t('userDetail') }}</Button>
                <Button type="text" class="redC" @click="openHistoryTable(row)">{{ $t('alarmHistory') }}</Button>
                <Button type="text" class="blueC" @click="cancelViewLists(row)">{{ $t('cancelMonitoring') }}</Button>
              </div>
            </template>
          </Table>
        </div>
        <Col :span="24" class="mt-5">
          <Page :page-size="pageSize" @on-change="currentpage" :current="nursePageNo" :total="nurseTotal" show-elevator show-total></Page>
        </Col>
      </div>
      <div class="history-list view-list" v-if="viewHistoryFlag">
        <div>
          <span style="color: #007eff; font-size: 16px" class="pointer" @click="closeHistory">{{ $t('electricityCare') }}</span>
          <span style="font-size: 16px">> {{ $t('alarmHistory') }}</span>
        </div>
        <div style="margin-top: 20px"></div>
        <Table :columns="historyList" :data="historyData">
          <template slot-scope="{ row }" slot="macs">{{ row.macName + '(' + row.mac + ')' }}</template>
          <template slot-scope="{ row }" slot="liness">{{ row.addrName + '(' + row.mac + row.addr + ')' }}</template>
          <template slot-scope="{ row }" slot="keeperName">
            <div>{{ row.keeperName }}</div>
            <div>{{ row.telephone.split(',')[0] ? '(' + row.telephone.split(',')[0] + ')' : '(' + row.telephone + ')' }}</div>
          </template>
          <template slot-scope="{ row }" slot="viewPer">
            <div>{{ row.personName }}</div>
            <div>{{ row.personTelephone.split(',')[0] ? '(' + row.personTelephone.split(',')[0] + ')' : '(' + row.personTelephone + ')' }}</div>
          </template>
          <template slot-scope="{ row }" slot="timer">{{ row.timeAt + $t('timeSpan') }}</template>
        </Table>
        <Col :span="24" class="mt-5">
          <Page :page-size="pageHistorySize" @on-change="currenHistorytpage" :current="nurseHistoryPageNo" :total="nurseHistoryTotal" show-elevator show-total></Page>
        </Col>
      </div>
    </div>
    <div v-if="detailUsers">
      <div class="back-details">
        <div class="title-heads">
          <div>
            <span style="color: #007eff; font-size: 16px" class="pointer" @click="closeDetails">{{ $t('electricityCare') }}</span>
            <span style="font-size: 16px">> {{ $t('objectDetail') }}</span>
          </div>
          <div>
            <div v-if="isEditShow">
              <Button type="primary" ghost @click="openEdit">{{ $t('edit') }}</Button>
            </div>
            <div v-else>
              <Button type="primary" ghost style="margin-right: 10px" @click="saveEdits">{{ $t('save') }}</Button>
              <Button type="default" @click="closeEdit">{{ $t('cancel') }}</Button>
            </div>
          </div>
        </div>
        <div v-if="isEditShow">
          <div class="deatil-flex">
            <div class="imgss-flex">
              <div style="width: 80px; height: 80px">
                <Avatar :src="imgUrlEdit" alt="" style="width: 100%; height: 100%" shape="square" />
              </div>
            </div>
            <div class="contents">
              <div>
                <div class="deatil-flex">
                  <div class="imgss-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('fullName') }}：</div>
                      <div class="four-flexs">{{ formValidate.name }}</div>
                    </div>
                  </div>
                  <div class="info-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('age') }}：</div>
                      <div class="five-flexs">{{ formValidate.age }}</div>
                    </div>
                  </div>
                </div>
                <div class="deatil-flex">
                  <div class="imgss-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('gender') }}：</div>
                      <div class="four-flexs">{{ formValidate.gender === 'male' ? $t('male') : formValidate.gender === 'female' ? $t('female') : $t('unknown2') }}</div>
                    </div>
                  </div>
                  <div class="info-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('contactNumber') }}：</div>
                      <div class="five-flexs">{{ formValidate.telephone }}</div>
                    </div>
                  </div>
                </div>
                <div class="deatil-flex">
                  <div class="imgss-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('addr') }}：</div>
                      <div class="four-flexs">{{ formValidate.provinceEdit + formValidate.cityEdit + formValidate.areaEdit }}</div>
                    </div>
                  </div>
                  <div class="info-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('addrDetail') }}：</div>
                      <div class="five-flexs">{{ formValidate.detailAddress }}</div>
                    </div>
                  </div>
                </div>
                <div class="deatil-flex">
                  <div class="imgss-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('liveAddress') }}：</div>
                      <div class="four-flexs">{{ formValidate.build + formValidate.unit + formValidate.room }}</div>
                    </div>
                  </div>
                  <div class="info-flex"></div>
                </div>
                <div class="deatil-flex">
                  <div class="imgss-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('isLiveAlone') }}：</div>
                      <div class="four-flexs">{{ formValidate.alone === 'true' ? $t('yes') : $t('no') }}</div>
                    </div>
                  </div>
                  <div class="info-flex">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('isHandicap') }}：</div>
                      <div class="five-flexs">{{ formValidate.physical === 'true' ? $t('yes') : $t('no') }}</div>
                    </div>
                  </div>
                </div>
                <div class="deatil-flex">
                  <div class="imgss-flex" style="margin-left: -30px">
                    <div class="deatil-flex">
                      <div class="grays-color rights-text imgss-flex">{{ $t('isHaveDisease') }}：</div>
                      <div style="flex: 2">{{ formValidate.disease === 'true' ? $t('yes') : $t('no') }}</div>
                    </div>
                  </div>
                  <div class="info-flex">
                    <div class="deatil-flex" style="margin-left: 10px">
                      <div class="grays-color rights-text imgss-flex">{{ $t('isLiveSelf') }}：</div>
                      <div style="flex: 9">{{ formValidate.takeCare === 'true' ? $t('yes2') : $t('no2') }}</div>
                    </div>
                  </div>
                </div>
                <!-- 此处v-for -->
                <div style="margin-top: 25px">
                  <h4>{{ $t('relativeOne') }}</h4>
                  <div class="deatil-flex">
                    <div class="imgss-flex">
                      <div class="deatil-flex">
                        <div class="grays-color rights-text imgss-flex">{{ $t('kinship') }}：</div>
                        <div class="four-flexs">{{ formValidate.relation1 }}</div>
                      </div>
                    </div>
                    <div class="info-flex">
                      <div class="deatil-flex">
                        <div class="grays-color rights-text imgss-flex">{{ $t('fullName') }}：</div>
                        <div class="five-flexs">{{ formValidate.relationName1 }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="deatil-flex">
                    <div class="imgss-flex">
                      <div class="deatil-flex">
                        <div class="grays-color rights-text imgss-flex">{{ $t('contactMethod') }}：</div>
                        <div class="four-flexs">{{ formValidate.relationTel1 }}</div>
                      </div>
                    </div>
                    <div class="info-flex"></div>
                  </div>
                </div>
                <div v-if="formValidate.relation2 || formValidate.relationName2 || formValidate.relationTel2">
                  <h4>{{ $t('relativeTwo') }}</h4>
                  <div class="deatil-flex">
                    <div class="imgss-flex">
                      <div class="deatil-flex">
                        <div class="grays-color rights-text imgss-flex">{{ $t('kinship') }}：</div>
                        <div class="four-flexs">{{ formValidate.relation2 === 'undefined' ? '-' : formValidate.relation2 }}</div>
                      </div>
                    </div>
                    <div class="info-flex">
                      <div class="deatil-flex">
                        <div class="grays-color rights-text imgss-flex">{{ $t('fullName') }}：</div>
                        <div class="five-flexs">{{ formValidate.relationName2 === 'undefined' ? '-' : formValidate.relationName2 }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="deatil-flex">
                    <div class="imgss-flex">
                      <div class="deatil-flex">
                        <div class="grays-color rights-text imgss-flex">{{ $t('contactMethod') }}：</div>
                        <div class="four-flexs">{{ formValidate.relationTel2 === 'undefined' ? '-' : formValidate.relationTel2 }}</div>
                      </div>
                    </div>
                    <div class="info-flex"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="deatil-flex">
            <div class="imgss-flex">
              <div style="width: 80px; height: 80px">
                <Avatar :src="imgUrlEdit" alt="" style="width: 100%; height: 100%" shape="square" />
              </div>
              <Upload ref="upload" :on-success="onSuccess" :format="['jpg', 'jpeg', 'png']" :max-size="2048" :before-upload="onBeforeUpload" :on-error="onError" :data="imgData" :name="imgData.name" :show-upload-list="false" type="drag" :action="actionUrl">
                <Button type="primary" ghost class="button-upload">{{ $t('upload') }}</Button>
              </Upload>
            </div>
            <div class="contents">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <Row>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('source')}:`">
                      <ButtonGroup>
                        <Button type="primary" ghost :style="isActive === 'one' ? 'color:#258cf0' : 'color:#999999;border:1px solid #999;'" @click="cancelDisable" v-if="!noPersonAdd">{{ $t('edit') }}</Button>
                        <Button type="primary" ghost :style="isActive === 'two' ? 'color:#258cf0' : 'color:#999999;border:1px solid #999;'" @click="addancelDisable" v-if="noPersonAdd">{{ $t('add1') }}</Button>
                        <Button type="primary" ghost :style="isActive === 'three' ? 'color:#258cf0' : 'color:#999;border:1px solid #999;'" @click="getNameDatas">{{ $t('alreadyHas') }}</Button>
                      </ButtonGroup>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="numSpan">
                    <FormItem prop="name" :label="`${$t('fullName')}:`">
                      <div v-if="selectIsHave !== $t('alreadyHas')">
                        <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.name" :style="isRedError ? 'border:1px solid red;width:202px' : ''" @on-blur="getChangeValue(formValidate.name)"></Input>
                        <div v-if="isRedError" style="color: red">{{ $t('nameCannotEmpty') }}</div>
                      </div>

                      <div>
                        <Select v-model="formValidate.name" v-if="selectIsHave === $t('alreadyHas')" filterable style="width: 200px" :placeholder="$t('pleaseSelectExistingUser')" clearable @on-select="getChangePerson" ref="selectForms">
                          <Option v-for="item in nameDatas" :value="item.value" :key="item.value + Math.random() * 500">{{ item.label + '(' + item.telephone + ')' }}</Option>
                        </Select>
                      </div>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem prop="age" :label="`${$t('age')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model.number="formValidate.age" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('gender')}:`" prop="gender">
                      <RadioGroup v-model="formValidate.gender">
                        <Radio label="male" :disabled="formValidate.gender !== 'male' && disableForm">{{ $t('male') }}</Radio>
                        <Radio label="female" :disabled="formValidate.gender !== 'female' && disableForm">{{ $t('female') }}</Radio>
                        <Radio label="noknows" :disabled="formValidate.gender !== 'noknows' && disableForm">{{ $t('unknown2') }}</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('contactNumber')}:`" prop="telephone">
                      <Input v-model="formValidate.telephone" :placeholder="$t('pleaseEnter')" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('addr')}:`" required>
                      <Row>
                        <Col>
                          <FormItem prop="province">
                            <Select v-model="formValidate.province" :placeholder="$t('pleaseSelectProvince')" style="width: 120px" @on-change="getCity" :disabled="disableForm">
                              <Option v-for="(item, index) in allProvince" :key="index" :value="item.value" :label="item.label">{{ item.label }}</Option>
                            </Select>
                          </FormItem>
                        </Col>
                        <Col>
                          <FormItem prop="city">
                            <Select v-model="formValidate.city" :placeholder="$t('pleaseSelectCity')" style="width: 120px; margin: 0 10px" @on-change="getAreas" :disabled="disableForm">
                              <Option v-for="(item, index) in allCountry" :key="index" :value="item.value" :label="item.label">{{ item.label }}</Option>
                            </Select>
                          </FormItem>
                        </Col>
                        <Col>
                          <FormItem prop="area">
                            <Select v-model="formValidate.area" :placeholder="$t('pleaseSelectArea')" style="width: 120px" :disabled="disableForm" @on-change="getAreasValue">
                              <Option v-for="(item, index) in allArea" :key="index" :value="item.value" :label="item.label">{{ item.label }}</Option>
                            </Select>
                          </FormItem>
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('addrDetail')}:`" prop="detailAddress">
                      <Input v-model="formValidate.detailAddress" :placeholder="$t('pleaseEnter')" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormItem :label="`${$t('liveAddress')}:`" required>
                      <Row>
                        <Col>
                          <FormItem prop="build">
                            <Input v-model="formValidate.build" :placeholder="$t('pleaseEnterBuilding')" :disabled="disableForm"></Input>
                          </FormItem>
                        </Col>
                        <Col style="margin: 0 10px">
                          <FormItem prop="unit">
                            <Input v-model="formValidate.unit" :placeholder="$t('pleaseEnterUnit')" :disabled="disableForm"></Input>
                          </FormItem>
                        </Col>
                        <Col>
                          <FormItem prop="room">
                            <Input v-model="formValidate.room" :placeholder="$t('pleaseEnterRoom')" :disabled="disableForm"></Input>
                          </FormItem>
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('isLiveAlone')}:`">
                      <RadioGroup v-model="formValidate.alone">
                        <Radio label="true" :disabled="formValidate.alone !== 'true' && disableForm">{{ $t('yes') }}</Radio>
                        <Radio label="false" :disabled="formValidate.alone !== 'false' && disableForm">{{ $t('no') }}</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('isHandicap')}:`">
                      <RadioGroup v-model="formValidate.physical">
                        <Radio label="true" :disabled="formValidate.physical !== 'true' && disableForm">{{ $t('yes') }}</Radio>
                        <Radio label="false" :disabled="formValidate.physical !== 'false' && disableForm">{{ $t('no') }}</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('isHaveDisease')}:`">
                      <RadioGroup v-model="formValidate.disease">
                        <Radio label="true" :disabled="formValidate.disease !== 'true' && disableForm">{{ $t('yes') }}</Radio>
                        <Radio label="false" :disabled="formValidate.disease !== 'false' && disableForm">{{ $t('no') }}</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('isLiveSelf')}:`">
                      <RadioGroup v-model="formValidate.takeCare">
                        <Radio label="true" :disabled="formValidate.takeCare !== 'true' && disableForm">{{ $t('yes2') }}</Radio>
                        <Radio label="false" :disabled="formValidate.takeCare !== 'false' && disableForm">{{ $t('no2') }}</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                </Row>
                <h4>{{ $t('relativeOne') }}</h4>
                <Row>
                  <Col :span="numSpan">
                    <FormItem prop="relation1" :label="`${$t('kinship')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.relation1" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem prop="relationName1" :label="`${$t('fullName')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.relationName1" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem prop="relationTel1" :label="`${$t('contactMethod')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.relationTel1" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <h4>{{ $t('relativeTwo') }}</h4>
                <Row>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('kinship')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.relation2" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('fullName')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.relationName2" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                  <Col :span="numSpan">
                    <FormItem :label="`${$t('contactMethod')}:`">
                      <Input :placeholder="$t('pleaseEnter')" v-model="formValidate.relationTel2" :disabled="disableForm"></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="viewPersonEdits">
      <div class="pd-ts">
        <Row :gutter="10" class="">
          <Col><Input v-model="perTelphone" :placeholder="$t('pleaseEnterGridderNameOrPhone')" style="width: 235px"></Input></Col>
          <Col><Input v-model="perMacIds" :placeholder="$t('topologyPlaceholder2')"></Input></Col>
          <Col>
            <Button class="b-blue" @click="queryPerson">{{ $t('query') }}</Button>
            <Button @click="perReset" style="margin-left: 10px">{{ $t('reset') }}</Button>
          </Col>
        </Row>
      </div>

      <div class="pd-ts">
        <div class="dis-flx">
          <div>
            <span style="color: #007eff; font-size: 16px" class="pointer" @click="closePersons">{{ $t('electricityCare') }}</span>
            <span style="font-size: 16px">> {{ $t('gridderManagement') }}</span>
          </div>
          <div>
            <Button type="primary" ghost @click="addTablePer">{{ $t('addGridder') }}</Button>
          </div>
        </div>
        <div class="person-list">
          <div v-for="(item, index) in perSonManageList" :key="index" class="boxs-person">
            <div v-if="item.isView">
              <div class="ds-flex" style="margin-top: 10px">
                <div class="flex-1" style="margin-left: 40px">
                  <div style="width: 80px; height: 80px; border: 1px solid #3d3d41">
                    <Avatar :src="item.urlImage" alt="" style="width: 100%; height: 100%" shape="square" />
                  </div>
                </div>
                <div class="flex-5">
                  <div class="ds-flex">
                    <div class="flex-1 mlt-10" style="padding-left: 28px">
                      <span class="grays-color rights-text">{{ $t('fullName') }}：</span>
                      <span>{{ item.name || '-' }}</span>
                    </div>
                    <div class="flex-1 mlt-10">
                      <span class="grays-color">{{ $t('contactNumber') }}：</span>
                      <span>{{ item.telephone }}</span>
                    </div>
                    <div class="flex-1 mlt-10">
                      <span class="grays-color">{{ $t('mailbox') }}：</span>
                      <span>{{ item.email || '-' }}</span>
                    </div>
                    <div class="flex-1 mlt-10">
                      <div class="dis-flx">
                        <div>
                          <span class="grays-color">{{ $t('bindAccount') }}：</span>
                          <span>{{ item.staffName || '-' }}</span>
                        </div>
                        <div>
                          <i class="icon-v5 icon-v5-s-operation" style="color: #007eff; border: 1px solid #007eff; background: rgba(0, 126, 255, 0.1); padding: 5px; margin-right: 10px; border-radius: 5px; font-size: 18px" @click="changeEdit(item)"></i>
                          <i class="icon-v5 icon-v5-lajitong" @click="delTablePer(item, index)" style="color: #e03c3a; border: 1px solid #e03c3a; background: rgba(224, 60, 58, 0.1); padding: 5px; border-radius: 5px; font-size: 18px"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mlt-10">
                    <span class="grays-color">{{ $t('areaOfResponsibility') }}：</span>
                    <span>{{ item.dutyRegion }}</span>
                  </div>
                  <div>
                    <div class="ds-flex">
                      <div class="flex-1 mlt-10">
                        <span class="grays-color">{{ $t('notificationMethod') }}：</span>
                      </div>
                      <div class="flex-8 mlt-10">
                        <div class="ds-flex">
                          <div class="flex-1">
                            <span class="mlr-10">{{ $t('normal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.tel" :true-value="1" :false-value="0" disabled>{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.loop" :true-value="1" :false-value="0" disabled>{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.normal.loop === 1">{{ $t('carouselDuration') }} ：{{ item.noticeConf.normal.loopInterval }}{{ '(s)' }}</span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.sms" :true-value="1" :false-value="0" disabled>{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.mail" :true-value="1" :false-value="0" disabled>{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                          <div class="flex-1 mlt-10">
                            <span class="mlr-10">{{ $t('lowAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.tel" :true-value="1" :false-value="0" disabled>{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.loop" :true-value="1" :false-value="0" disabled>{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.low.loop === 1">{{ $t('carouselDuration') }} ：{{ item.noticeConf.low.loopInterval }}{{ '(s)' }}</span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.sms" :true-value="1" :false-value="0" disabled>{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.mail" :true-value="1" :false-value="0" disabled>{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                        </div>
                        <div class="ds-flex mlt-10">
                          <div class="flex-1">
                            <span class="mlr-10">{{ $t('mediumAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.tel" :true-value="1" :false-value="0" :disabled="true">{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.loop" :true-value="1" :false-value="0" disabled>{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.middle.loop === 1">{{ $t('carouselDuration') }} ：{{ item.noticeConf.middle.loopInterval }}{{ '(s)' }}</span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.sms" :true-value="1" :false-value="0" disabled>{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.mail" :true-value="1" :false-value="0" disabled>{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                          <div class="flex-1 mlt-10">
                            <span class="mlr-10">{{ $t('higherAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.tel" :true-value="1" :false-value="0" disabled>{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.loop" :true-value="1" :false-value="0" disabled>{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.higher.loop === 1">{{ $t('carouselDuration') }} ：{{ item.noticeConf.higher.loopInterval }} {{ '(s)' }}</span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.sms" :true-value="1" :false-value="0" disabled>{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.mail" :true-value="1" :false-value="0" disabled>{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                        </div>
                        <div class="ds-flex mlt-10">
                          <div class="flex-1">
                            <span class="mlr-10">{{ $t('highAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.tel" :true-value="1" :false-value="0" disabled>{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.loop" :true-value="1" :false-value="0" disabled>{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.highest.loop === 1">{{ $t('carouselDuration') }} ：{{ item.noticeConf.highest.loopInterval }} {{ '(s)' }}</span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.sms" :true-value="1" :false-value="0" disabled>{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.mail" :true-value="1" :false-value="0" disabled>{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                          <div class="flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!item.isView">
              <div class="ds-flex" style="margin-top: 10px">
                <div class="flex-1" style="margin-left: 40px">
                  <div style="width: 80px; height: 80px; border: 1px solid #3d3d41">
                    <Avatar :src="item.urlImage" alt="" style="width: 100%; height: 100%" shape="square" />
                  </div>

                  <Upload
                    ref="upload"
                    :on-success="(res, file, fileList) => onSuccessPerson(res, file, fileList, item, index)"
                    :format="['jpg', 'jpeg', 'png']"
                    :max-size="2048"
                    :before-upload="onBeforeUpload"
                    :on-error="onError"
                    :data="imgData"
                    :name="imgData.name"
                    :show-upload-list="false"
                    type="drag"
                    :action="actionUrl">
                    <Button type="primary" ghost class="button-upload">{{ $t('upload') }}</Button>
                  </Upload>
                </div>
                <div class="flex-5">
                  <div class="ds-flex">
                    <div class="flex-1 mlt-10" style="padding-left: 28px">
                      <span class="grays-color rights-text">{{ $t('fullName') }}：</span>
                      <span><Input style="width: 200px" v-model="item.name" :placeholder="$t('pleaseEnter')"></Input></span>
                    </div>
                    <div class="flex-1 mlt-10">
                      <span class="grays-color">{{ $t('mailbox') }}：</span>
                      <span><Input style="width: 200px" v-model="item.email" :placeholder="$t('pleaseEnter')"></Input></span>
                    </div>
                    <div class="flex-1 mlt-10">
                      <div class="dis-flx">
                        <div>
                          <span class="grays-color">{{ $t('bindAccount') }}：</span>
                          <span><Input style="width: 200px" v-model="item.staffName" :placeholder="$t('pleaseEnter')"></Input></span>
                        </div>
                        <div>
                          <Button type="primary" ghost style="margin-right: 10px" @click="saveNurseEdit(item)">{{ $t('save') }}</Button>
                          <Button style="color: #c5c8ce; background-color: #323742; border-color: #62646a" ghost @click="cancelPersonEdits(item)">{{ $t('cancel') }}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mlt-10" style="display: flex">
                    <span class="grays-color">{{ $t('contactNumber') }}：</span>
                    <span>
                      <Input v-model="item.telephoneEdits" :placeholder="$t('pleaseEnter')" style="width: 200px; margin-right: 10px"></Input>
                      <span v-for="(v, i) in item.telList" :key="v.value">
                        <span style="position: relative">
                          <Input v-model="v.tels" :placeholder="$t('pleaseEnter')" style="width: 200px; margin-right: 10px"></Input>
                          <i @click="delTelList(item.telList, i)" class="icon-v5 icon-v5-lajitong" style="position: absolute; right: 15px; top: -5px; font-size: 18px; color: red"></i>
                        </span>
                      </span>
                    </span>
                    <span>
                      <Button type="primary" ghost @click="addPersonTel(item.telList)">{{ $t('addContactPhone') }}</Button>
                    </span>
                  </div>
                  <div class="mlt-10">
                    <span class="grays-color">{{ $t('areaOfResponsibility') }}：</span>
                    <span><Input style="width: 400px" v-model="item.dutyRegion" :placeholder="$t('pleaseEnter')"></Input></span>
                  </div>
                  <div>
                    <div class="ds-flex">
                      <div class="flex-1 mlt-10">
                        <div class="grays-color">{{ $t('notificationMethod') }}：</div>
                      </div>
                      <div class="flex-9 mlt-10">
                        <div class="ds-flex">
                          <div class="flex-1">
                            <span class="mlr-10">{{ $t('normal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.tel" :true-value="1" :false-value="0" :disabled="false">{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.loop" :true-value="1" :false-value="0" :disabled="false">{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.normal.loop === 1">
                                {{ $t('carouselDuration') }}
                                <InputNumber class="inline-inputs" :max="90" v-model="item.noticeConf.normal.loopInterval" @on-blur="getMorethirty(item.noticeConf.normal)"></InputNumber>
                                <span>{{ '(S)' }}</span>
                              </span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.sms" :true-value="1" :false-value="0" :disabled="false">{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.normal.mail" :true-value="1" :false-value="0" :disabled="false">{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                          <div class="flex-1 mlt-10">
                            <span class="mlr-10">{{ $t('lowAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.tel" :true-value="1" :false-value="0" :disabled="false">{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.loop" :true-value="1" :false-value="0" :disabled="false">{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.low.loop === 1">
                                {{ $t('carouselDuration') }}
                                <InputNumber class="inline-inputs" :max="90" v-model="item.noticeConf.low.loopInterval" @on-blur="getMorethirty(item.noticeConf.low)"></InputNumber>
                                <span>{{ '(S)' }}</span>
                              </span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.sms" :true-value="1" :false-value="0" :disabled="false">{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.low.mail" :true-value="1" :false-value="0" :disabled="false">{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                        </div>
                        <div class="ds-flex mlt-10">
                          <div class="flex-1">
                            <span class="mlr-10">{{ $t('mediumAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.tel" :true-value="1" :false-value="0" ::disabled="false">{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.loop" :true-value="1" :false-value="0" :disabled="false">{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.middle.loop === 1">
                                {{ $t('carouselDuration') }}
                                <InputNumber class="inline-inputs" :max="90" v-model="item.noticeConf.middle.loopInterval" @on-blur="getMorethirty(item.noticeConf.middle)"></InputNumber>
                                <span>{{ '(S)' }}</span>
                              </span>
                              {{ ')' }}
                            </span>

                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.sms" :true-value="1" :false-value="0" :disabled="false">{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.middle.mail" :true-value="1" :false-value="0" :disabled="false">{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                          <div class="flex-1 mlt-10">
                            <span class="mlr-10">{{ $t('higherAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.tel" :true-value="1" :false-value="0" :disabled="false">{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.loop" :true-value="1" :false-value="0" :disabled="false">{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.higher.loop === 1">
                                {{ $t('carouselDuration') }}
                                <InputNumber class="inline-inputs" :max="90" v-model="item.noticeConf.higher.loopInterval" @on-blur="getMorethirty(item.noticeConf.higher)"></InputNumber>
                                <span>{{ '(S)' }}</span>
                              </span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.sms" :true-value="1" :false-value="0" :disabled="false">{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.higher.mail" :true-value="1" :false-value="0" :disabled="false">{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                        </div>
                        <div class="ds-flex mlt-10">
                          <div class="flex-1">
                            <span class="mlr-10">{{ $t('highAbnormal') }}：</span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.tel" :true-value="1" :false-value="0" :disabled="false">{{ $t('phone') }}</Checkbox>
                              {{ '(' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.loop" :true-value="1" :false-value="0" :disabled="false">{{ $t('carousel') }}</Checkbox>
                              <span v-if="item.noticeConf.highest.loop === 1">
                                {{ $t('carouselDuration') }}
                                <InputNumber class="inline-inputs" :max="90" v-model="item.noticeConf.highest.loopInterval" @on-blur="getMorethirty(item.noticeConf.highest)"></InputNumber>
                                <span>{{ '(S)' }}</span>
                              </span>
                              {{ ')' }}
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.sms" :true-value="1" :false-value="0" :disabled="false">{{ $t('sms') }}</Checkbox>
                            </span>
                            <span class="mlr-10">
                              <Checkbox v-model="item.noticeConf.highest.mail" :true-value="1" :false-value="0" :disabled="false">{{ $t('email') }}</Checkbox>
                            </span>
                          </div>
                          <div class="flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider style="margin: 25px 0" />
            <div v-if="item.isTableShow">
              <div class="title-heads">
                <h4></h4>
                <div>
                  <Button type="primary" ghost @click="addViewLine('singleEdits', item, index)" style="margin-right: 10px">{{ $t('addWatchLine') }}</Button>
                  <Button type="error" :disabled="item.channelList.filter(v => v._checked).length === 0" ghost @click="cancelViewLines(item.channelList, index)">
                    <span :style="item.channelList.filter(v => v._checked).length === 0 ? 'color:#999999 ' : ''">{{ $t('deleteWatchLine') }}</span>
                  </Button>
                </div>
              </div>
              <div style="margin-top: 10px">
                <Table
                  :data="item.channelList"
                  :columns="item.perSonChannel"
                  @on-select="
                    (selection, row) => {
                      personSelecChange(selection, row, item.channelList, true)
                    }
                  "
                  @on-select-cancel="
                    (selection, row) => {
                      personSelecChange(selection, row, item.channelList, false)
                    }
                  "
                  @on-select-all="
                    selection => {
                      personSelectAll(selection, item.channelList, true)
                    }
                  "
                  @on-select-all-cancel="
                    selection => {
                      personSelectAll(selection, item.channelList, false)
                    }
                  ">
                  <template slot-scope="{ row }" slot="macsper">{{ row.macName + '(' + row.mac + ')' }}</template>
                  <template slot-scope="{ row }" slot="linessper">{{ row.addrTitle + '(' + row.showAddr + ')' }}</template>
                  <template slot-scope="{ row }" slot="viewPerper">
                    <div v-if="row.personName">
                      {{ row.personName + '(' + row.personTelephone + ')' }}
                    </div>
                  </template>
                  <template slot-scope="{ row }" slot="actionsesper">
                    <div style="display: flex">
                      <Button type="text" class="blueC" @click="openSingleConfig(row)">{{ $t('parameterConfiguration') }}</Button>
                      <Button type="text" class="blueC" @click="openUserInfo(row, 'userDetails')">{{ $t('userDetail') }}</Button>
                      <Button type="text" class="redC" @click="openHistoryTable(row, 'userDetails')">{{ $t('alarmHistory') }}</Button>
                    </div>
                  </template>
                </Table>
                <div v-if="item.loadAll" style="text-align: center">
                  <Button type="text" class="blueC" @click="getAllList(item)">{{ $t('loadAll') }}</Button>
                </div>
                <div v-if="!item.loadAll" style="text-align: center">
                  <Button type="text" class="blueC" @click="cacelAllList(item)">{{ $t('collapseAlreadyAll') }}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 批量 -->
    <Modal :title="$t('parameterConfiguration')" v-model="paramConfigModal" width="800">
      <div v-if="isShowTools" style="padding: 5px; color: red; border: 1px solid red; margin: 10px">
        <span>
          <Icon color="red" size="16" type="ios-information-circle-outline" style="margin: 0 5px" />
        </span>
        <span>{{ tools }}</span>
      </div>
      <Row :gutter="20">
        <Col>
          <div style="display: flex; padding-top: 5px">
            <div style="color: #007eff; font-weight: 800; margin-right: -5px">{{ $t('sensitivity') }}</div>
            <TooltipVue style="margin-top: 2px">
              <div>{{ proAlltext }}</div>
              <div>{{ textOne }}</div>
              <div>{{ textTwo }}</div>
              <div>{{ textThree }}</div>
            </TooltipVue>
            <div>:</div>
          </div>
        </Col>
        <Col>
          <InputNumber v-model="sensitiVity" :min="0" :formatter="value => value.toFixed(2)" :step="0.01" style="width: 200px"></InputNumber>
        </Col>
      </Row>
      <Row style="margin-top: 20px" :gutter="20">
        <Col style="margin-left: 7px">{{ $t('detectionPeriod') }}:</Col>
        <Col :span="21">
          <Row>
            <Col :span="4" v-for="(item, index) in timerList" :key="index">
              <Checkbox v-model="item.value" @on-change="getLowNine">&nbsp;{{ $t('periodOfTime', { num: item.time }) }}</Checkbox>
            </Col>
          </Row>
        </Col>
      </Row>
      <div slot="footer">
        <Col class="fr">
          <Button type="primary" @click="handleOk">{{ $t('confirm') }}</Button>
          <Button @click="paramConfigModal = false">{{ $t('cancel') }}</Button>
        </Col>
      </div>
    </Modal>
    <!-- 单个 -->
    <Modal :title="$t('parameterConfiguration')" v-model="singleConfigModal" width="1100">
      <div v-if="isSingleShowTools" style="padding: 5px; color: red; border: 1px solid red; margin: 10px">
        <span>
          <Icon color="red" size="16" type="ios-information-circle-outline" style="margin: 0 5px" />
        </span>
        <span>{{ tools }}</span>
      </div>
      <Row :gutter="20">
        <Col>
          <div style="display: flex; padding-top: 5px">
            <div style="color: #007eff; font-weight: 800; margin-right: -5px">{{ $t('sensitivity') }}</div>
            <TooltipVue style="margin-top: 2px">
              <div>{{ proAlltext }}</div>
              <div>{{ textOne }}</div>
              <div>{{ textTwo }}</div>
              <div>{{ textThree }}</div>
            </TooltipVue>
            <div>:</div>
          </div>
        </Col>
        <Col>
          <InputNumber v-model="seniVitySingle" :min="0" @on-blur="saveTwo(seniVitySingle)" style="width: 200px"></InputNumber>
        </Col>
      </Row>
      <Row style="margin-top: 20px" :gutter="20">
        <Col style="margin-left: 7px">{{ $t('detectionPeriod') }}:</Col>
        <Col :span="21">
          <div style="width: 100%; display: flex; flex-wrap: wrap">
            <div class="box-flexs" v-for="(item, index) in titleList" :key="index">
              <div v-if="index < 8" class="box-heads" :style="{ 'border-right': (index + 1) % 8 === 0 ? '1px solid #565A64' : '' }">
                <div>{{ item.text }}</div>
                <TooltipVue v-if="index % 2 === 1">
                  <div>{{ $t('detectionPeriodTips1') }}</div>
                  <div>{{ $t('detectionPeriodTips2') }}</div>
                </TooltipVue>
              </div>
            </div>
            <div class="content-flex" v-for="(item, index) in singleListData" :key="item.times + item.seninVity">
              <div class="box-flexs-two">
                <Checkbox v-model="item.value" @on-change="getLowNines">&nbsp;{{ item.times }}</Checkbox>
              </div>
              <div class="box-flexs-two" :style="{ 'border-right': (index + 1) % 4 === 0 ? '1px solid #565A64' : '' }" @mouseenter="showReset(item)" @mouseleave="disRest(item)">
                <span :style="{ color: item.seninVity > 1 ? '#EA903A' : '' }">{{ item.seninVity }}</span>
                <span v-if="item.seninVity > 1">
                  <span v-show="item.showReset" class="pointer restess" @click="getRestItem(item)">{{ $t('reset') }}</span>
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Col class="fr">
          <Button type="primary" @click="handleSave">{{ $t('confirm') }}</Button>
          <Button @click="singleConfigModal = false">{{ $t('cancel') }}</Button>
        </Col>
      </div>
    </Modal>
    <!-- 线路看护弹窗 -->
    <Modal :title="$t('addWatchLine')" v-model="viewLinesModal" width="1100" class="add-lines">
      <div style="margin-bottom: 20px" v-show="isShowPersons">
        <span>
          {{ $t('gridder') }}：
          <Select v-model="addNursePersons" style="width: 200px" :placeholder="$t('pleaseSelectGridman')" :clearable="true">
            <Option v-for="item in nursePersonList" :value="item.value" :key="item.value" :label="item.name"></Option>
          </Select>
        </span>
      </div>
      <Row :gutter="10">
        <Col><Input v-model="enterMac" :placeholder="$t('EnterDevice')"></Input></Col>
        <Col><Input v-model="enterAdrress" :placeholder="$t('enterPosition')"></Input></Col>
        <Col>
          <Select v-model="addpacketType" @on-change="addHandleType" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
            <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
          </Select>
        </Col>
        <Col>
          <TreeSelect :placeholder="$t('selectGroup')" multiple style="width: 200px" show-checkbox v-model="addPacketFilter" transfer :data="addFilterList" />
        </Col>
        <Col><Button type="primary" @click="queryDevicesLists">{{ $t('query') }}</Button></Col>
        <Col><Button type="default" @click="resetLists">{{ $t('reset') }}</Button></Col>
      </Row>
      <Row style="margin-top: 20px">
        <Col :span="12" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox v-if="deviceLIsts.length" :value="deviceLIsts.filter(v => !!v.checked).length === deviceLIsts.length" :indeterminate="deviceLIsts.filter(v => !!v.checked).length !== 0 && deviceLIsts.filter(v => !!v.checked).length !== deviceLIsts.length" @on-change="getAllDeviceValue">
              {{ $t('selectDevice') }}
            </Checkbox>
            <div v-else>{{ $t('selectDevice') }}</div>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div v-for="item in deviceLIsts" :key="item.mac">
              <div class="dis-flx">
                <div>
                  <Checkbox class="checkboxlist" v-model="item.checked" :indeterminate="isIndermin(item.addrs)" :disabled="item.disabled" ref="macRef" @on-change="checkSelectQuery($event, item)">
                    <span style="width: calc(100% - 24px); margin-left: 10px" @click.stop.prevent="clickLable(item.mac, item.disabeld)">
                      <span
                        :style="{
                          color: item.mac === curClickedNode ? '#0c70dd' : '#fff',
                        }">
                        {{ item.name }}
                      </span>
                    </span>
                  </Checkbox>
                </div>
                <div
                  :style="{
                    color: item.mac === curClickedNode ? '#0c70dd' : '#fff',
                    'margin-left': '50px',
                  }">
                  {{ '>' }}
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col :span="12" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox v-if="curLines.length" :value="curLines.filter(v => !!v.checked).length === curLines.length" @on-change="lineCheckAll" :indeterminate="isIndeterminate">
              {{ $t('selectLine') }}
            </Checkbox>
            <span v-else>{{ $t('selectLine') }}</span>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div>
              <Input :placeholder="$t('linenameTosearch')" v-model="lineKeyword" />
            </div>
            <Checkbox style="padding: 5px; display: block" v-for="(item, index) in curLines" :key="item.addr + item.title + index" :value="item.checked" v-show="item.title.includes(lineKeyword)" :disabled="item.disabled" @on-change="linesChange($event, item, index)" ref="lineRef">
              <span>
                <span>{{ item.title }}</span>
              </span>
            </Checkbox>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Col class="fr">
          <Button type="primary" @click="saveDeviceList">{{ $t('confirm') }}</Button>
          <Button @click="viewLinesModal = false">{{ $t('cancel') }}</Button>
        </Col>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getGroupType,
    getGroupTree,
    elecNursekeeperList,
    keeperListSimple,
    keeperSaveelecNurse,
    channelListElecNurse,
    getAreaInfoList,
    pageQueryAddr,
    channelSelectelecNurse,
    channelDelelecNurse,
    personInfoEcNurse,
    personRelateEcNurse,
    personListEcNurse,
    personSaveEcNurse,
    channelAddEcNurse,
    paramInfoEcNurse,
    paramConfig,
    pageAlarmHistory,
    keeperDelelEcNurse,
  } from '@/api/public'
  import { cloneTree, getTree, timeListData, titleList } from './nurseData'
  export default {
    name: 'multiManage-nurseList',
    data() {
      return {
        isClear: true,
        isResetMacLine: false,
        isRedError: false,
        macData: [],
        nurseHistoryPageNo: 1,
        pageHistorySize: 10,
        nurseHistoryTotal: 0,
        loveViewAlarm: false,
        channeldsParms: '',
        isIndexPerson: '',
        isShowPersons: false,
        rowData: {},
        channelIds: '',
        disableForm: false,
        loading1: false,
        isActive: '',
        nameDatas: [],
        selectIsHave: this.$t('add1'),
        noPersonAdd: true,
        perSonIds: '',
        levelTypes: '',
        levelList: [
          { value: -1, label: this.$t('all2') },
          { value: 0, label: this.$t('normal') },
          { value: 1, label: this.$t('lowAbnormal') },
          { value: 2, label: this.$t('mediumAbnormal') },
          { value: 3, label: this.$t('higherAbnormal') },
          { value: 4, label: this.$t('highAbnormal') },
        ],
        perSonManageList: [
          {
            isView: true,
            urlImage: '',
            telephone: '',
            name: '',
            email: '',
            staffName: '',
            telephoneEdits: '',
            isTableShow: false,
            channelList: [],
            chanelListAll: [],
            telList: [],
            loadAll: true,
            noticeConf: {
              normal: {
                mail: 0,
                loop: 0,
                loopInterval: 30,
                sms: 0,
                tel: 0,
              },
              low: {
                mail: 1,
                loop: 0,
                loopInterval: 30,
                sms: 0,
                tel: 0,
              },
              middle: {
                mail: 0,
                loop: 0,
                loopInterval: 30,
                sms: 0,
                tel: 0,
              },
              higher: {
                mail: 0,
                loop: 0,
                loopInterval: 30,
                sms: 0,
                tel: 0,
              },
              highest: {
                mail: 0,
                loop: 0,
                loopInterval: 30,
                sms: 0,
                tel: 0,
              },
            },
            dutyRegion: '',
            perSonChannel: [
              {
                type: 'selection',
                width: 60,
                align: 'center',
              },
              { title: this.$t('owningDevice'), slot: 'macsper', align: 'left' },
              { title: this.$t('line'), slot: 'linessper', align: 'left' },
              { title: this.$t('watchObject'), slot: 'viewPerper', align: 'left' },
              { title: this.$t('watchObjectAddress'), key: 'personAddress', align: 'left' },
              { title: this.$t('operation'), slot: 'actionsesper', align: 'left', width: 290 },
            ],
          },
        ],
        perMacIds: '',
        perTelphone: '',
        macLinesList: [],
        lines: '',
        viewPersonEdits: false,
        historyData: [],
        historyList: [
          { title: this.$t('owningDevice'), slot: 'macs', align: 'left' },
          { title: this.$t('line'), slot: 'liness', align: 'left' },
          { title: this.$t('gridder'), slot: 'keeperName', align: 'left' },
          { title: this.$t('watchObject'), slot: 'viewPer', align: 'left' },
          { title: this.$t('watchObjectAddress'), key: 'address', align: 'left' },
          { title: this.$t('abnormalPeriod'), slot: 'timer', align: 'left' },
          { title: this.$t('correctionParameters'), key: 'adjVal', align: 'left' },
        ],
        viewTableFlag: true,
        viewHistoryFlag: false,
        numSpan: 10,
        allCountry: [],
        allArea: [],
        allProvince: [],
        formValidate: {
          name: '',
          age: '',
          gender: '',
          telephone: '',
          provinceEdit: '',
          cityEdit: '',
          areaEdit: '',
          province: '',
          city: '',
          area: '',
          build: '',
          unit: '',
          room: '',
          alone: 'false',
          physical: 'false',
          disease: 'false',
          takeCare: 'true',
          relation1: '',
          relationName1: '',
          detailAddress: '',
          relationTel1: '',
          relation2: '',
          relationName2: '',
          relationTel2: '',
        },
        ruleValidate: {
          name: [{ required: true, type: 'any', message: this.$t('nameCannotEmpty'), trigger: 'blur' }],
          age: [{ required: true, type: 'number', message: this.$t('ageCannotEmpty'), trigger: 'blur' }],
          telephone: [{ required: true, message: this.$t('contactNumberCannotEmpty'), trigger: 'blur' }],
          city: [{ required: true, message: this.$t('addressCannotEmpty'), trigger: 'change' }],
          province: [{ required: true, message: this.$t('addressCannotEmpty'), trigger: 'change' }],
          area: [{ required: true, message: this.$t('addressCannotEmpty'), trigger: 'change' }],
          detailAddress: [{ required: true, message: this.$t('addressDetailCannotEmpty'), trigger: 'blur' }],
          build: [{ required: true, message: this.$t('buildingNot'), trigger: 'blur' }],
          unit: [{ required: true, message: this.$t('unitNot'), trigger: 'blur' }],
          room: [{ required: true, message: this.$t('roomNot'), trigger: 'blur' }],
          relation1: [{ required: true, message: this.$t('kinshipCannotEmpty'), trigger: 'blur' }],
          relationName1: [{ required: true, message: this.$t('nameCannotEmpty'), trigger: 'blur' }],
          relationTel1: [{ required: true, message: this.$t('phoneCannotEmpty'), trigger: 'blur' }],
        },
        imgData: {
          name: 'name',
        },
        actionUrl: '/common/file/upload.as?fileType=1&&urlAbsolute=true',
        // imgUrls: require('../../../assets/images/noimg.jpg'),
        imgUrlEdit: '',
        isEditShow: true,
        detailUsers: false,
        indexLists: true,
        lineKeyword: '',
        curClickedNode: '',
        curLines: [],
        deviceLIsts: [],
        addFilterList: [],
        addPacketFilter: '',
        addpacketType: '',
        enterMac: '',
        enterAdrress: '',
        addNursePersons: '',
        viewLinesModal: false,
        isSingleShowTools: false,
        singleConfigModal: false,
        isShowTools: false,
        tools: this.$t('electricityCareTips1'),
        proAlltext: this.$t('electricityCareTips2'),
        textOne: this.$t('electricityCareTips3'),
        textTwo: this.$t('electricityCareTips4'),
        textThree: this.$t('electricityCareTips5'),
        sensitiVity: 3,
        seniVitySingle: 3,
        titleList,
        singleListData: [],
        paramConfigModal: false,
        nurseTotal: 0,
        timerList: timeListData,
        pageSize: 10,
        nursePageNo: 1,
        formInline: {
          mac: '',
          macLine: [],
          packetTypes: '',
          packetFilter: [],
          nursePersons: '',
          telPhone: '',
          levelTypes: '',
        },
        packetList: [],
        packetFilterList: [],
        nursePersonList: [{ name: '张三', value: '3' }],
        columnNurse: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: this.$t('owningDevice'),
            slot: 'devices',
            width: 150,
            align: 'left',
          },
          {
            title: this.$t('line'),
            slot: 'lines',
            align: 'left',
          },
          {
            title: this.$t('gridder'),
            slot: 'nusrePer',
            align: 'left',
          },
          {
            title: this.$t('watchObject'),
            slot: 'viewPer',
            align: 'left',
          },
          {
            title: this.$t('watchObjectAddress'),
            slot: 'viewPerAddress',
            align: 'left',
          },
          {
            title: '',
            slot: 'noNomalLevel',
            align: 'left',
            width: '210',
            renderHeader: h => {
              return h('div', { style: { display: 'flex' } }, [
                h('span', this.$t('last30dayAbnormalLevelDistribution')),
                h(
                  'Tooltip',
                  {
                    props: {
                      placement: 'top',
                      maxWidth: '300',
                      transfer: true,
                    },
                  },
                  [
                    h('Icon', {
                      props: {
                        color: '#007EFF',
                        size: '16',
                        type: 'ios-information-circle-outline',
                      },
                      style: {
                        marginLeft: '5px',
                      },
                    }),
                    h(
                      'div',
                      {
                        slot: 'content',
                        style: {
                          whiteSpace: 'normal',
                        },
                      },
                      [
                        h('span', { style: { color: '#0DD667' } }, this.$t('normal')),
                        h('span', ':'),
                        h('span', { style: { color: '#E0E71C' } }, this.$t('lowAbnormal')),
                        h('span', ':'),
                        h('span', { style: { color: '#007EFF' } }, this.$t('mediumAbnormal')),
                        h('span', ':'),
                        h('span', { style: { color: '#EA903A' } }, this.$t('higherAbnormal')),
                        h('span', ':'),
                        h('span', { style: { color: '#E03C3A' } }, this.$t('highAbnormal')),
                      ]
                    ),
                  ]
                ),
              ])
            },
          },
          {
            title: this.$t('todayCareCode'),
            slot: 'todayLove',
            align: 'left',
          },
          {
            title: this.$t('todayAbnormalPeriod'),
            slot: 'todaynoNomal',
            align: 'left',
            width: 165,
          },
          {
            title: this.$t('operation'),
            slot: 'actiongs',
            align: 'left',
            width: 380,
          },
        ],
        nurseListData: [],
      }
    },
    created() {
      this.getGroupTypes()
      this.getAllPerson()
      this.getAdrressList()
      this.getChannelList()
      this.getAllMac()
    },
    computed: {
      isIndeterminate() {
        return this.curLines.filter(v => !!v.checked).length !== 0 && this.curLines.filter(v => !!v.checked).length !== this.curLines.length
      },
      isIndermin() {
        return addrData => {
          return addrData.filter(v => v.checked).length !== addrData.length && addrData.length !== 0 && addrData.filter(v => v.checked).length !== 0
        }
      },
    },
    methods: {
      getMorethirty(val) {
        if (val.loopInterval < 30) {
          val.loopInterval = 30
        }
      },
      saveTwo(val) {
        this.seniVitySingle = +val.toFixed(2)
      },
      getChangeValue(val) {
        if (!val) {
          this.isRedError = true
        } else {
          this.isRedError = false
        }
      },
      getAllMac() {
        let params = {
          projectCode: this.$store.state.projectCode,
          pageSize: 1000,
          equipmentTypes: '1,2,19',
          pageNo: 1,
        }
        pageQueryAddr(params).then(res => {
          if (res.success) {
            this.macData = res.datas.map(item => ({
              value: item.mac,
              label: item.name + '(' + item.mac + ')',
              children:
                item.addrs.map(v => ({
                  value: String(v.addr),
                  label: v.title,
                })) || [],
            }))
          }
        })
      },
      currenHistorytpage(e) {
        this.nurseHistoryPageNo = e
        this.getHistoryTable()
      },
      getAllList(item) {
        let allLists = item.chanelListAll
        item.channelList = allLists
        item.loadAll = false
      },
      cacelAllList() {
        this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
      },
      personSelecChange(selection, row, list, val) {
        list.forEach(v => {
          if (v.channelId === row.channelId) {
            v._checked = val
          }
        })
      },
      personSelectAll(selection, list, val) {
        list.forEach(v => {
          v._checked = val
        })
      },
      cancelDisable() {
        if (this.isActive === 'one') return
        this.isActive = 'one'
        this.selectIsHave = this.$t('edit')
        this.disableForm = false

        this.openUserInfo(this.rowData, this.$t('alreadyEdited'))
      },
      addancelDisable() {
        if (this.isActive === 'two') return
        this.isActive = 'two'
        this.selectIsHave = this.$t('add1')
        this.disableForm = false
        this.$refs.formValidate.resetFields()
      },
      getNameDatas() {
        if (this.isActive === 'three') return
        this.isActive = 'three'
        this.selectIsHave = this.$t('alreadyHas')
        this.disableForm = true
        this.formValidate.name = ''
        let parmas = {
          projectCode: this.$store.state.projectCode,
          nameKeword: '',
        }
        personListEcNurse(parmas).then(res => {
          if (res.success) {
            this.nameDatas = res.data.map(item => ({ ...item, value: item.personId, label: item.name }))
          }
        })
      },
      getChangePerson(val) {
        //
        this.perSonIds = val.value
        // this.formValidate.name = val.label.split('(')[0]
        this.nameDatas.forEach(item => {
          if (item.personId === val.value) {
            this.imgUrlEdit = item.photo || ''

            this.formValidate = {
              name: item.name,
              age: item.age,
              gender: item.sex === 1 ? 'male' : item.sex === 2 ? 'female' : 'noknows',
              telephone: item.telephone,
              provinceEdit: item.province,
              cityEdit: item.city,
              areaEdit: item.county,
              build: item.build,
              unit: item.unit,
              room: item.room,
              detailAddress: item.street,
              alone: item.isAlone === 1 ? 'true' : 'false',
              physical: item.isDisability === 1 ? 'true' : 'false',
              disease: item.isIll === 1 ? 'true' : 'false',
              takeCare: item.isCareself === 1 ? 'true' : 'false',
              relation1: item.kin1Relation,
              relationName1: item.kin1Name,
              relationTel1: item.kin1Contact,
              relation2: item.kin2Relation || '',
              relationName2: item.kin2Name || '',
              relationTel2: item.kin2Contact || '',
            }

            this.allProvince.forEach(v => {
              if (v.label === item.province) {
                this.formValidate.province = v.value
              }
            })
            getAreaInfoList({ provinceId: this.formValidate.province, cityId: '' }).then(resd => {
              if (resd.success) {
                this.allCountry = resd.data.map(v => ({ value: v.id, label: v.name }))
                this.allCountry.forEach(v => {
                  if (v.label === item.city) {
                    this.formValidate.city = v.value
                  }
                })
                getAreaInfoList({ provinceId: this.formValidate.province, cityId: this.formValidate.city }).then(respose => {
                  if (respose.success) {
                    this.allArea = respose.data.map(v => ({ value: v.id, label: v.name }))
                    this.allArea.forEach(v => {
                      if (v.label === item.county) {
                        this.formValidate.area = v.value
                      }
                    })
                  }
                })
              }
            })
          }
        })
      },
      cancelViewLists(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmCancelLineGridderMonitor'),
          onOk: () => {
            channelDelelecNurse({ channeIds: row.channelId })
              .then(res => {
                if (res.success) {
                  this.nursePageNo = 1
                  this.getChannelList()
                } else if (res.code === '-1') {
                } else {
                  if (res.message) {
                    this.$Message.error({
                      content: res.message,
                    })
                  } else {
                    this.$Message.error({
                      content: this.$t('unknown'),
                    })
                  }
                }
              })
              .catch(err => {
                if (err) {
                  this.$Message.error({
                    content: this.$t('unknown'),
                  })
                }
              })
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
      getChannelList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          nodeIds: String(this.formInline.packetFilter) || '',
          keeperId: this.formInline.nursePersons,
          level: this.formInline.levelTypes,
          pageNo: this.nursePageNo,
          pageSize: this.pageSize,
          personKeyword: this.formInline.telPhone,
          macKeyword: this.formInline.mac,
        }
        channelListElecNurse(params).then(res => {
          if (res.success) {
            this.nurseListData = res.datas.map(item => ({
              ...item,
              _checked: false,
              id: item.channelId,
              levelCompare0: item.levelTotalList.filter(v => v.level === 0),
              levelCompare1: item.levelTotalList.filter(v => v.level === 1),
              levelCompare2: item.levelTotalList.filter(v => v.level === 2),
              levelCompare3: item.levelTotalList.filter(v => v.level === 3),
              levelCompare4: item.levelTotalList.filter(v => v.level === 4),
            }))
            this.nurseTotal = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getAreas(val) {
        getAreaInfoList({ provinceId: this.formValidate.province, cityId: val }).then(res => {
          if (res.success) {
            this.allCountry.forEach(item => {
              if (item.value === val) {
                this.formValidate.cityEdit = item.label
              }
            })
            this.allArea = res.data.map(v => ({ value: v.id, label: v.name }))
          }
        })
      },
      getAreasValue(val) {
        this.allArea.forEach(item => {
          if (item.value === val) {
            this.formValidate.areaEdit = item.label
          }
        })
      },
      getCity(val) {
        getAreaInfoList({ provinceId: val, cityId: '' }).then(res => {
          if (res.success) {
            // this.
            this.allProvince.forEach(v => {
              if (v.value === val) {
                this.formValidate.provinceEdit = v.label
              }
            })
            this.allCountry = res.data.map(v => ({ value: v.id, label: v.name }))
          }
        })
      },
      getAdrressList() {
        getAreaInfoList().then(res => {
          if (res.success) {
            this.allProvince = res.data.map(v => ({ value: v.id, label: v.name }))
          }
        })
      },
      getAllPerson() {
        keeperListSimple({ projectCode: this.$store.state.projectCode }).then(res => {
          if (res.success) {
            this.nursePersonList = res.data.map(item => ({ name: item.name, value: item.kpId, isLoginUser: item.isLoginUser }))
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      saveNurseEdit(item) {
        let telArr
        if (item.telList.length > 0) {
          telArr = item.telList.map(v => v.tels).join(',')
        } else {
          telArr = ''
        }
        // if(||!item.email||!item.telephoneEdits||!item.dutyRegion)
        if (!item.name) {
          return this.$Message.error({
            content: this.$t('pleaseFillGridderName'),
          })
        }
        if (!item.email) {
          return this.$Message.error({
            content: this.$t('pleaseFillGridderEmail'),
          })
        }
        if (!item.telephoneEdits) {
          return this.$Message.error({
            content: this.$t('pleaseFillGridderPhone'),
          })
        }
        if (!item.dutyRegion) {
          return this.$Message.error({
            content: this.$t('pleaseFillGridderArea'),
          })
        }
        let param = {
          projectCode: this.$store.state.projectCode,
          kpId: item.kpId || 0,
          photo: item.urlImage || '',
          name: item.name || '',
          telephone: telArr.length > 0 ? item.telephoneEdits + ',' + telArr : item.telephoneEdits,
          email: item.email,
          staffName: item.staffName,
          dutyRegion: item.dutyRegion,
          noticeConf: JSON.stringify(item.noticeConf),
        }
        keeperSaveelecNurse(param).then(res => {
          if (res.success) {
            this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      delTablePer(item, i) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteGridderInfo'),
          onOk: () => {
            if (!item.kpId) {
              this.perSonManageList.splice(i, 1)
              this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
            } else {
              keeperDelelEcNurse({ kpId: item.kpId }).then(res => {
                if (res.success) {
                  this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
                } else {
                  this.$Message.error({
                    content: res.message,
                  })
                }
              })
            }
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
      addTablePer() {
        this.perSonManageList.unshift({
          isView: false,
          urlImage: '',
          telephone: '',
          name: '',
          kpId: 0,
          email: '',
          telephoneEdits: '',
          isTableShow: false,
          staffName: '',
          channelList: [],
          chanelListAll: [],
          telList: [],
          loadAll: true,
          noticeConf: {
            normal: {
              mail: 0,
              loop: 0,
              loopInterval: 30,
              sms: 0,
              tel: 0,
            },
            low: {
              mail: 0,
              loop: 0,
              loopInterval: 30,
              sms: 0,
              tel: 0,
            },
            middle: {
              mail: 0,
              loop: 0,
              loopInterval: 30,
              sms: 0,
              tel: 0,
            },
            higher: {
              mail: 0,
              loop: 0,
              loopInterval: 30,
              sms: 0,
              tel: 0,
            },
            highest: {
              mail: 0,
              loop: 0,
              loopInterval: 30,
              sms: 0,
              tel: 0,
            },
          },
          dutyRegion: '',
          perSonChannel: [
            {
              type: 'selection',
              width: 60,
              align: 'center',
            },
            { title: this.$t('owningDevice'), slot: 'macsper', align: 'left' },
            { title: this.$t('line'), slot: 'linessper', align: 'left' },
            { title: this.$t('watchObject'), slot: 'viewPerper', align: 'left' },
            { title: this.$t('watchObjectAddress'), key: 'personAddress', align: 'left' },
            { title: this.$t('operation'), slot: 'actionsesper', align: 'left', width: 290 },
          ],
        })
      },
      delTelList(val, i) {
        val.splice(i, 1)
      },
      cancelPersonEdits(item) {
        item.isView = true
        item.telList = []
        this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
      },
      changeEdit(item) {
        item.isView = false
        item.telephoneEdits = item.telephone.includes(',')
          ? item.telephone
              .split(',')
              .filter((v, i) => i === 0)
              .join()
          : item.telephone
        item.telList = item.telephone.includes(',')
          ? item.telephone
              .split(',')
              .filter((v, i) => i > 0)
              .map(j => ({ value: Math.random() * 5000, tels: j }))
          : []
      },
      addPersonTel(val) {
        if (val.length >= 4) {
          return this.$Message.error({
            content: this.$t('addMostFive'),
          })
        }
        val.push({ value: Math.random() * 5000, tels: '' })
      },
      openViewLines(item, index) {},
      cancelViewLines(list, index) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteMonitorLine'),
          onOk: () => {
            let channeIds = list
              .filter(v => v._checked)
              .map(j => j.channelId)
              .join(',')
            let parmas = {
              channeIds,
            }
            channelDelelecNurse(parmas).then(res => {
              if (res.success) {
                this.$Message.success({
                  content: this.$t('deleteSuccessful'),
                })
                this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
      closePersons() {
        this.viewPersonEdits = false
        this.indexLists = true
        this.getChannelList()
      },
      getAllelecNurse(param, type) {
        elecNursekeeperList(param).then(res => {
          if (res.success) {
            this.perSonManageList = res.data.map(item => ({
              ...item,
              isView: true,
              urlImage: item.photo,
              telephoneEdits: item.telephone.includes(',')
                ? item.telephone
                    .split(',')
                    .filter((v, i) => i === 0)
                    .join()
                : item.telephone,
              telList: item.telephone.includes(',')
                ? item.telephone
                    .split(',')
                    .filter((v, i) => i > 0)
                    .map(j => ({ value: Math.random() * 5000, tels: j }))
                : [],
              loadAll: true,
              isTableShow: true,
              perSonChannel: [
                {
                  type: 'selection',
                  width: 60,
                  align: 'center',
                },
                { title: this.$t('owningDevice'), slot: 'macsper', align: 'left' },
                { title: this.$t('line'), slot: 'linessper', align: 'left' },
                { title: this.$t('watchObject'), slot: 'viewPerper', align: 'left' },
                { title: this.$t('watchObjectAddress'), key: 'personAddress', align: 'left' },
                { title: this.$t('operation'), slot: 'actionsesper', align: 'left', width: 290 },
              ],
              channelList: item.channelList.length > 0 ? item.channelList.map(v => ({ ...v, _checked: false })).filter((item, index) => index < 10) : [],
              chanelListAll: item.channelList.length > 0 ? item.channelList.map(v => ({ ...v, _checked: false })) : [],
            }))
            if (type === 'open') {
              this.viewPersonEdits = true
              this.indexLists = false
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      openPersonManage() {
        let param = { projectCode: this.$store.state.projectCode }
        this.getAllelecNurse(param, 'open')
      },
      perReset() {
        this.perTelphone = ''
        this.perMacIds = ''
      },
      queryPerson() {
        let parmas = {
          projectCode: this.$store.state.projectCode,
          kpKeyword: this.perTelphone,
          macKeyword: this.perMacIds,
        }
        this.getAllelecNurse(parmas)
      },
      saveEdits() {
        if (!this.formValidate.name) {
          return this.$Message.error({
            content: this.$t('pleaseFillUserInfoThenSave'),
          })
        }
        this.$nextTick(() => {
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              if (this.isActive === 'three') {
                let params = {
                  channelId: this.channelIds,
                  personId: this.perSonIds,
                }
                personRelateEcNurse(params).then(res => {
                  if (res.success) {
                    this.$Message.success({
                      content: this.$t('savedSuccessfully'),
                    })
                    this.rowData.personId = this.perSonIds
                    this.openUserInfo(this.rowData)
                  }
                })
              } else {
                let param = {
                  channelId: this.channelIds,
                  personId: this.perSonIds,
                  name: this.formValidate.name,
                  sex: this.formValidate.gender === 'male' ? 1 : this.formValidate.gender === 'female' ? 2 : 0,
                  age: this.formValidate.age,
                  telephone: this.formValidate.telephone,
                  photo: this.imgUrlEdit,
                  province: this.formValidate.provinceEdit,
                  city: this.formValidate.cityEdit,
                  county: this.formValidate.areaEdit,
                  street: this.formValidate.detailAddress,
                  build: this.formValidate.build,
                  unit: this.formValidate.unit,
                  room: this.formValidate.room,
                  isAlone: this.formValidate.alone === 'true' ? 1 : 0,
                  isDisability: this.formValidate.physical === 'true' ? 1 : 0,
                  isIll: this.formValidate.disease === 'true' ? 1 : 0,
                  isCareself: this.formValidate.takeCare === 'true' ? 1 : 0,
                  kin1Name: this.formValidate.relationName1,
                  kin1Relation: this.formValidate.relation1,
                  kin1Contact: this.formValidate.relationTel1,
                  kin2Name: this.formValidate.relationName2 || '',
                  kin2Relation: this.formValidate.relation2 || '',
                  kin2Contact: this.formValidate.relationTel2 || '',
                }
                personSaveEcNurse(param).then(res => {
                  if (res.success) {
                    this.rowData.personId = res.data.personId
                    this.$Message.success({
                      content: this.$t('savedSuccessfully'),
                    })
                    this.openUserInfo(this.rowData)
                  }
                })
              }
            } else {
            }
          })
        })
      },
      openHistoryTable(row, type) {
        if (!row.mac) {
          this.isResetMacLine = true
          this.isClear = true
        } else {
          this.isResetMacLine = false
          this.isClear = false
        }
        if (type === 'userDetails') {
          this.viewPersonEdits = false
          this.viewTableFlag = false
          this.indexLists = true
          this.viewHistoryFlag = true
        } else {
          this.viewHistoryFlag = true
          this.viewTableFlag = false
        }
        if (row.addr && row.mac) {
          this.formInline.macLine = [row.mac, String(row.addr)]
        } else {
          this.formInline.macLine = []
        }
        let parmars = {
          projectCode: this.$store.state.projectCode,
          pageNo: this.nurseHistoryPageNo,
          pageSize: this.pageHistorySize,
          nodeId: '',
          keeperName: '',
          keyword1: '',
          keyword2: row.mac || '',
          addr: row.addr || '',
        }
        this.getHistoryTable(parmars)
      },
      getHistoryTable(parmars) {
        let parms = {}
        if (parmars) {
          parms = parmars
        } else {
          parms = {
            projectCode: this.$store.state.projectCode,
            pageNo: this.nurseHistoryPageNo,
            pageSize: this.pageHistorySize,
            nodeId: String(this.formInline.packetFilter) || '',
            keeperName: this.formInline.nursePersons,
            keyword1: this.formInline.telPhone,
            keyword2: this.formInline.macLine[0] || '',
            addr: this.formInline.macLine[1] || '',
          }
        }
        pageAlarmHistory(parms).then(res => {
          if (res.success) {
            this.historyData = res.datas
            this.nurseHistoryTotal = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      closeHistory() {
        this.viewHistoryFlag = false
        this.viewTableFlag = true
        this.getChannelList()
      },
      closeDetails() {
        this.indexLists = true
        this.detailUsers = false
        this.isEditShow = true
        this.getChannelList()
      },
      onSuccess(res, file, fileList) {
        // this.imgUrlEdit = require('../../../assets/images/noimg.jpg')
        this.imgUrlEdit = res.data // 此处请求用户详情接口拿到用户图片地址
        this.$Message.success({
          content: this.$t('uploadSuccess'),
        })
      },
      onSuccessPerson(res, file, fileList, item, index) {
        item.urlImage = res.data
        // this.imgUrlEdit = require(res.data)此处请求用户详情接口拿到用户图片地址
        this.$Message.success({
          content: this.$t('uploadSuccess'),
        })
      },
      onError() {
        this.$Message.error({
          content: this.$t('uploadFail'),
        })
      },
      onBeforeUpload(file) {
        let acceptArr = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
        const isIMAGE = acceptArr.includes(file.type)
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isIMAGE) {
          this.$Message.error(this.$t('onlyInsertImg'))
        }
        if (!isLt1M) {
          this.$Message.error(this.$t('cannotExceed1m'))
        }
        return isLt1M && isIMAGE
      },
      openEdit() {
        this.isEditShow = false
      },
      closeEdit() {
        if (this.noPersonAdd) {
          this.detailUsers = false
          this.indexLists = true
        } else {
          this.isEditShow = true
        }
      },
      handleSave() {
        if (this.singleListData.filter(item => item.value).length < 9) {
          this.isSingleShowTools = true
          return
        }
        if (!this.seniVitySingle) {
          return this.$Message.error({
            content: this.$t('correctionFactorCannotEmpty'),
          })
        }
        let timeAdjs = this.singleListData.filter(item => item.value).map(v => ({ time: v.time, adj: v.seninVity }))
        let parmas = {
          channeIds: this.channeldsParms,
          sens: this.seniVitySingle,
          timeAdjs: JSON.stringify(timeAdjs),
        }
        paramConfig(parmas).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('savedSuccessfully'),
            })
            if (this.indexLists) {
              this.getChannelList()
            } else if (this.viewPersonEdits) {
              this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
            }
            this.singleConfigModal = false
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getRestItem(val) {
        val.seninVity = '1.00'
      },
      showReset(val) {
        val.showReset = true
      },
      disRest(val) {
        val.showReset = false
      },
      getLowNine() {
        if (this.timerList.filter(item => item.value).length < 9) {
          if (!this.isShowTools) this.isShowTools = true
        } else {
          this.isShowTools = false
        }
      },
      getLowNines() {
        if (this.singleListData.filter(item => item.value).length < 9) {
          if (!this.isSingleShowTools) this.isSingleShowTools = true
        } else {
          this.isSingleShowTools = false
        }
      },
      openSingleConfig(val) {
        this.channeldsParms = val.channelId
        paramInfoEcNurse({ channeId: val.channelId }).then(res => {
          if (res.success) {
            this.seniVitySingle = +res.data.sens
            this.singleListData = res.data.timeSlot.map(item => ({ ...item, times: this.$t('periodOfTime', { num: item.time }), seninVity: item.adj, value: item.isSelected, showReset: false }))
            this.singleConfigModal = true
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      currentpage(e) {
        this.nursePageNo = e
        this.getChannelList()
      },
      openParamConfig(val) {
        this.paramConfigModal = true
        this.timerList.forEach(item => {
          item.value = true
        })
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        getGroupType(params)
          .then(res => {
            if (res.success) {
              this.packetList = res && res.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleTypes(val) {
        this.formInline.packetTypes = val
        this.getGroupTrees()
      },
      addHandleType(val) {
        this.addpacketType = val
        getGroupTree({ groupId: this.addpacketType }).then(res => {
          if (res.success) {
            let resData = getTree(res.data)
            this.addFilterList = cloneTree(resData)
          }
        })
      },
      getGroupTrees(val) {
        getGroupTree({ groupId: this.formInline.packetTypes })
          .then(res => {
            if (res.code === '0') {
              let resData = getTree(res.data)
              this.packetFilterList = cloneTree(resData)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      onSubmit(type) {
        // 查询分两种情况，一个是首页列表查询，一个是历史记录查询，报警历史记录分单个和所有
        if (type === 'formInline') {
        }
        if (this.viewTableFlag) {
          this.getChannelList()
        } else if (!this.viewTableFlag && this.viewHistoryFlag) {
          this.getHistoryTable()
        }
      },
      queryDevicesLists() {
        let params = {
          projectCode: this.$store.state.projectCode,
          mac: this.enterMac,
          nodeIds: String(this.addPacketFilter),
          location: this.enterAdrress,
        }
        this.getAllDeviceList(params)
      },
      resetLists() {
        this.enterMac = ''
        this.addPacketFilter = ''
        this.enterAdrress = ''
        this.addpacketType = ''
      },
      emptyReset() {
        if (this.isResetMacLine) {
          this.formInline.macLine = []
        }
        this.formInline = {
          mac: '',
          macLine: this.formInline.macLine,
          packetTypes: '',
          packetFilter: [],
          nursePersons: '',
          telPhone: '',
          levelTypes: '',
        }
      },
      addViewLine(type, item) {
        this.isIndexPerson = type
        this.curLines = []
        if (type === 'indexOpen') {
          this.isShowPersons = true
        } else {
          this.isShowPersons = false
          this.addNursePersons = item.kpId
        }

        let param = { projectCode: this.$store.state.projectCode, mac: '', nodeIds: '', location: '' }
        this.getAllDeviceList(param)
        // this.deviceLIsts = deveiceMac.map
      },
      getAllDeviceList(param) {
        channelSelectelecNurse(param).then(res => {
          if (res.success) {
            this.deviceLIsts = res.datas.map(item => ({ ...item, checked: false, disabled: item.canSelect === 0, addrs: item.addrs.map(v => ({ ...v, mac: item.mac, disabled: v.canSelect === 0, checked: false })) }))
            this.viewLinesModal = true
            this.nursePersonList.forEach(v => {
              if (v.isLoginUser) {
                this.addNursePersons = v.value
              }
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      checkSelectQuery(val, row) {
        row.checked = val
        row.addrs.forEach(item => {
          if (!item.disabled) {
            item.checked = val
          }
        })
      },
      clickLable(val, disabeld) {
        if (disabeld) {
          return
        }
        this.deviceLIsts.forEach(item => {
          if (item.mac === val) {
            this.curLines = item.addrs
          }
        })
        this.curClickedNode = val
      },
      linesChange(val, item, index) {
        this.curLines[index].checked = val
        if (val) {
          this.deviceLIsts.forEach(v => {
            if (v.mac === item.mac) {
              v.checked = true
            }
          })
        } else {
          this.deviceLIsts.forEach(v => {
            if (v.mac === item.mac) {
              v.checked = !(this.curLines.filter(j => j.checked).length === 0)
            }
          })
        }
      },
      lineCheckAll(val) {
        this.curLines.forEach(item => {
          item.checked = val
        })
      },
      getAllDeviceValue(val) {
        this.deviceLIsts.forEach(item => {
          if (!item.disabled) {
            item.checked = val
          }
          if (Array.isArray(item.addrs) && item.addrs.length) {
            item.addrs.forEach(v => {
              if (!v.disabled) {
                v.checked = val
              }
            })
          }
        })
      },
      saveDeviceList() {
        let filterArr = this.deviceLIsts.filter(item => item.checked && !item.disabeld)
        if (filterArr.length === 0) {
          return this.$Message.error({
            content: this.$t('pleaseSelectDeviceLine'),
          })
        }
        if (!this.addNursePersons) {
          return this.$Message.error({
            content: this.$t('pleaseSelectGridderFirst'),
          })
        }
        let addrArr = []
        filterArr.forEach(v => {
          addrArr.push({
            mac: v.mac,
            addrs: v.addrs
              .filter(j => j.checked)
              .map(itm => itm.addr)
              .join(),
          })
        })
        let params = {
          kpId: this.addNursePersons,
          macAddrsList: JSON.stringify(addrArr),
        }
        channelAddEcNurse(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('addSuccess'),
            })
            this.viewLinesModal = false
            if (this.isIndexPerson === 'singleEdits') {
              this.getAllelecNurse({ projectCode: this.$store.state.projectCode })
            } else {
              this.getChannelList()
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getSelecChange(selection, row) {
        this.nurseListData.forEach(item => {
          if (item.id === row.id) {
            item._checked = true
          }
        })
      },
      getCancelChange(selection, row) {
        this.nurseListData.forEach(item => {
          if (item.id === row.id) {
            item._checked = false
          }
        })
      },
      selectAll(val) {
        this.nurseListData.forEach(item => {
          item._checked = val
        })
      },
      openUserInfo(row, type) {
        this.rowData = row
        if (type === 'userDetails') {
          this.viewPersonEdits = false
        }
        this.detailUsers = true
        this.indexLists = false
        this.perSonIds = row.personId
        this.disableForm = false
        this.channelIds = row.channelId

        if (row.personId === 0) {
          this.isEditShow = false
          this.noPersonAdd = true
          this.selectIsHave = this.$t('add1')
          this.isActive = 'two'
          this.formValidate = {
            name: '',
            age: '',
            gender: '',
            telephone: '',
            province: '',
            provinceEdit: '',
            cityEdit: '',
            areaEdit: '',
            city: '',
            area: '',
            build: '',
            unit: '',
            room: '',
            alone: 'false',
            physical: 'false',
            disease: 'false',
            takeCare: 'true',
            relation1: '',
            relationName1: '',
            detailAddress: '',
            relationTel1: '',
            relation2: '',
            relationName2: '',
            relationTel2: '',
          }
        } else {
          if (type === this.$t('alreadyEdited')) {
            this.isEditShow = false
          } else {
            this.isEditShow = true
          }

          this.noPersonAdd = false
          this.selectIsHave = this.$t('edit')
          this.isActive = 'one'
          personInfoEcNurse({ personId: row.personId }).then(res => {
            if (res.success) {
              let newDatas = res.data
              this.imgUrlEdit = res.data.photo || ''
              this.formValidate = {
                name: res.data.name,
                age: res.data.age,
                gender: res.data.sex === 1 ? 'male' : res.data.sex === 2 ? 'female' : 'noknows',
                telephone: res.data.telephone,
                provinceEdit: res.data.province,
                cityEdit: res.data.city,
                areaEdit: res.data.county,
                build: res.data.build,
                unit: res.data.unit,
                room: res.data.room,
                detailAddress: res.data.street,
                alone: res.data.isAlone === 1 ? 'true' : 'false',
                physical: res.data.isDisability === 1 ? 'true' : 'false',
                disease: res.data.isIll === 1 ? 'true' : 'false',
                takeCare: res.data.isCareself === 1 ? 'true' : 'false',
                relation1: res.data.kin1Relation,
                relationName1: res.data.kin1Name,
                relationTel1: res.data.kin1Contact,
                relation2: res.data.kin2Relation || '',
                relationName2: res.data.kin2Name || '',
                relationTel2: res.data.kin2Contact || '',
              }
              this.allProvince.forEach(item => {
                if (item.label === newDatas.province || item.value === newDatas.province) {
                  this.formValidate.province = item.value
                }
              })
              getAreaInfoList({ provinceId: this.formValidate.province, cityId: '' }).then(resd => {
                if (resd.success) {
                  this.allCountry = resd.data.map(v => ({ value: v.id, label: v.name }))
                  this.allCountry.forEach(item => {
                    if (item.label === newDatas.city) {
                      this.formValidate.city = item.value
                    }
                  })
                  getAreaInfoList({ provinceId: this.formValidate.province, cityId: this.formValidate.city }).then(respose => {
                    if (respose.success) {
                      this.allArea = respose.data.map(v => ({ value: v.id, label: v.name }))
                      this.allArea.forEach(item => {
                        if (item.label === newDatas.county) {
                          this.formValidate.area = item.value
                        }
                      })
                    }
                  })
                }
              })
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        }
      },
      handleOk() {
        if (this.timerList.filter(item => item.value).length < 9) {
          this.isShowTools = true
          return
        }
        let channeIds = this.nurseListData
          .filter(v => v._checked)
          .map(j => j.channelId)
          .join(',')
        let timeAdjs = this.timerList.filter(v => v.value).map(item => ({ time: item.time, adj: '' }))
        let parmas = {
          channeIds,
          sens: this.sensitiVity,
          timeAdjs: JSON.stringify(timeAdjs),
        }
        paramConfig(parmas).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('setSuccessfully'),
            })
            this.paramConfigModal = false
            this.getChannelList()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
    },
  }
</script>

<style lang="less">
  .add-lines {
    .ivu-checkbox-disabled .ivu-checkbox-inner {
      background: #28282b;
      border: 1px solid #464652;
    }
  }

  .gray-style {
    background: rgba(153, 153, 153, 0.1);
    border: 1px solid #999999;
    border-radius: 0px 5px 5px 0px;
    color: #999999;
  }
  .active-style {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px 0px 0px 5px;
    color: #007eff;
  }
  .flex-ceters {
    flex: 1;
    text-align: right;
    margin-right: 5px;
  }
  .redBoxs {
    border: 1px solid #e03c3a;
    border-radius: 4px;
    color: #e03c3a;
    padding: 2px 8px;
    margin-top: 5px;
    margin-right: 5px;
  }
  .flex-8 {
    flex: 16;
  }
  .flex-9 {
    flex: 16;
  }
  .mlr-10 {
    margin-right: 10px;
  }
  .mlt-10 {
    margin-top: 10px;
  }
  .flex-1 {
    flex: 1;
  }
  .button-upload {
    width: 80px;
    margin-top: 20px;
    background: rgba(0, 126, 255, 0.1);
  }
  .rights-text {
    text-align: right;
  }
  .grays-color {
    color: #999999;
  }
  .four-flexs {
    flex: 3;
  }
  .five-flexs {
    flex: 10;
  }
  .deatil-flex {
    display: flex;
    margin: 10px 0;
  }
  .imgss-flex {
    flex: 1;
    .ivu-upload-drag {
      border: none;
      text-align: left;
    }
  }
  .info-flex {
    flex: 3;
  }
  .contents {
    flex: 8;
    Input {
      width: 200px;
    }
  }
  .contents .ivu-form-item-label {
    color: #999999 !important;
  }
  .back-details {
    padding: 20px;
    background: #1a202e;
    margin: 10px 10px 0 0;
    width: 100%;
  }
  .title-heads {
    display: flex;
    justify-content: space-between;
  }
  .dis-flx {
    display: flex;
    justify-content: space-between;
  }
  .checkboxlist {
    display: block;
    margin: 0 0 20px 0;
  }
  .box-flexs {
    width: 12.5%;
  }
  .restess {
    color: #007eff;
    margin-left: 15px;
  }
  .content-flex {
    width: 25%;
    display: flex;
  }
  .box-heads {
    display: flex;
    padding: 8px 10px 8px 20px;
    background: #28313f;
    border-top: 1px solid #565a64;
    border-left: 1px solid #565a64;
    border-bottom: 1px solid #565a64;
  }
  .box-flexs-two {
    width: 50%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    background: #1a202e;
    border-left: 1px solid #565a64;
    border-bottom: 1px solid #565a64;
  }
  #nurese-list {
    .inline-inputs {
      display: inline-block;
      width: 100px;
    }
    .ivu-checkbox-disabled .ivu-checkbox-inner {
      background: #28282b;
      border: 1px solid #464652;
    }
    .flex-5 {
      flex: 7;
    }
    .ds-flex {
      display: flex;
      .ivu-upload-drag {
        border: none;
        text-align: left;
      }
    }
    .boxs-person {
      border: 1px solid #424b5f;
      border-radius: 5px;
      padding: 10px;
      margin-top: 20px;
    }
    .pd-ts {
      margin: 10px 0;
      background: #1a202e;
      padding: 10px;
    }
    .query-list {
      // margin:10px ;
      padding: 0 10px;
      background: #1a202e;
    }
    .view-list {
      margin-top: 10px;
      padding: 20px 10px;
      background: #1a202e;
    }
    .form-inline {
      padding-top: 20px;
    }
    .list-head {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .marL {
      margin: 0 10px;
    }
    .marR {
      margin-right: 10px;
    }
    .blueC {
      color: #007eff;
    }
    .redC {
      color: #e03c3a;
    }
  }
</style>
